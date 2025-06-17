import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { Header } from "components";
import type { Route } from "./+types/create-trip";
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "~/lib/utils";
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import React, { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";

export const loader = async () => {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flag,latlng,maps"
  );
  const data = await response.json();
  //   console.log(data);

  return data.map((country: any) => ({
    name: country.flag + " " + country.name.common,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreetMap,
  }));
};

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
  const countries = loaderData as Country[];
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0].name || "",
    travelStyle: "",
    interest: "",
    budget: "",
    duration: 0,
    groupType: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (
      !formData.country ||
      !formData.budget ||
      !formData.duration ||
      !formData.groupType ||
      !formData.travelStyle ||
      !formData.interest
    ) {
      setLoading(false);
      setError("Please fill all the fields");
      return;
    }
    if (formData.duration < 1 || formData.duration > 10) {
      setLoading(false);
      setError("Duration should be between 1 and 10");
      return;
    }
    const user = await account.get();
    if (!user.$id) {
      setLoading(false);
      setError("Please sign in to create a trip");
      return;
    }
    try {
      const response = await fetch("/api/create-trip", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          travelStyle: formData.travelStyle,
          interest: formData.interest,
          budget: formData.budget,
          groupType: formData.groupType,
          userId: user.$id,
        }),
      });
      const result: CreateTripResponse = await response.json();
      if (result?.id) navigate(`/trips/${result.id}`);
      else {
        setError("Failed to create trip");
        console.error("Error creating trip:", result);
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  const mapData = [
    {
      country: formData.country,
      color: "#EA382E",
      coordinates: countries.find((c: Country) => c.name === formData.country)
        ?.coordinates,
    },
  ];
  const countryData = countries.map((country) => ({
    text: country.name,
    value: country.value,
  }));
  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header
        title="Add a New Trip"
        description="View and edit AI Generated travel plans"
      />
      <section className="mt-2.5 wrapper-md">
        <form className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: "text", value: "value" }}
              className="combo-box"
              placeholder="Select Country"
              change={(e: { value: string | undefined }) => {
                if (e.value) {
                  handleChange("country", e.value);
                }
              }}
              allowFiltering
              filtering={(e) => {
                const query = e.text.toLowerCase();
                e.updateData(
                  countries
                    .filter((country) =>
                      country.name.toLowerCase().includes(query)
                    )
                    .map((country) => ({
                      text: country.name,
                      value: country.value,
                    }))
                );
              }}
            />
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <input
              name="duration"
              type="number"
              id="duration"
              placeholder="Enter a Number of Days (e.g. 5)"
              className="form-input placeholder:text-gray-100"
              onChange={(e) => handleChange("duration", e.target.value)}
            />
          </div>
          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>
              <ComboBoxComponent
                id={key}
                dataSource={comboBoxItems[key].map((item) => ({
                  text: item,
                  value: item,
                }))}
                fields={{ text: "text", value: "value" }}
                placeholder={`Select ${formatKey(key)}`}
                change={(e: { value: string | undefined }) => {
                  if (e.value) {
                    handleChange(key, e.value);
                  }
                }}
                allowFiltering
                filtering={(e) => {
                  const query = e.text.toLowerCase();
                  e.updateData(
                    comboBoxItems[key]
                      .filter((item) => item.toLowerCase().includes(query))
                      .map((item) => ({
                        text: item,
                        value: item,
                      }))
                  );
                }}
                className="combo-box"
              />
            </div>
          ))}
          <div>
            <label htmlFor="location">Location on The World Map</label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  dataSource={mapData}
                  shapeData={world_map}
                  shapePropertyPath="name"
                  shapeDataPath="country"
                  shapeSettings={{ colorValuePath: "color", fill: "#e5e5e5" }}
                />
              </LayersDirective>
            </MapsComponent>
          </div>
          <div className="bg-gray-200 h-px w-full" />
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          <footer className="px-6 w-full">
            <ButtonComponent
              type="submit"
              className="button-class !h-12 !w-full"
              disabled={loading}
            >
              <img
                src={`/assets/icons/${loading ? "loader" : "magic-star"}.svg`}
                alt="Magic Star"
                className={cn("size-5", loading && "animate-spin")}
              />
              <span className="p-16-semibold text-white">
                {loading ? "Generating..." : "Generate Trip"}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
