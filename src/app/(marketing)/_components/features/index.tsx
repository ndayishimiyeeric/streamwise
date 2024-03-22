"use client";

import React from "react";
import Image from "next/image";

import { SectionHeader } from "../section-header";
import { featuresData } from "./featuresData";
import { SingleFeature } from "./singleFeature";

export const Feature = () => {
  return (
    <>
      {/* <!-- ===== Features Start ===== --> */}
      <section className="container py-20 lg:py-25 xl:py-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          {/* <!-- Section Title Start --> */}
          <SectionHeader
            headerInfo={{
              title: "FEATURES",
              subtitle: "Core features of our Streamwise",
              description: `Our platform is not just a tool, it's a gateway to new levels of understanding and efficiency. Here's what sets us apart`,
            }}
          />
          {/* <!-- Section Title End --> */}

          <div className="mt-12.5 grid grid-cols-1 gap-7.5 lg:mt-15 lg:grid-cols-2 xl:mt-20 xl:grid-cols-3 xl:gap-12.5">
            {/* <!-- Features item Start --> */}

            {featuresData.map((feature, key) => (
              <SingleFeature feature={feature} key={key} />
            ))}
            {/* <!-- Features item End --> */}
          </div>
        </div>
      </section>

      {/* <!-- ===== Features End ===== --> */}
    </>
  );
};
