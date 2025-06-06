"use client";

import ExerciseService from "@/lib/services/exercise.service";
import { Exercise } from "@/lib/types/exercise";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const ReadingExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const exerciseService = new ExerciseService();
  const pathname = usePathname()
  const locale = pathname.split("/")[1];
  useEffect(() => {
    const fetchExercises = async () => {
      exerciseService
        .getAll({ filters: { skill: "reading" } })
        .then((response) => {
          if (response.success) {
            console.log("Fetched exercises:", response.data);
            setExercises(response.data);
          } else {
            console.error("Failed to fetch exercises:", response.data);
          }
        });
    };
    fetchExercises();
  }, []);

  const writingExercises = exercises.filter(
    (exercise) => exercise.skill === "writing"
  );

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      {writingExercises.map((exercise) => (
        <Link
          key={exercise.id}
          href={`/${locale}/student/practice/writing/${exercise.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              width: "300px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 className="font-bold text-2xl">{exercise?.name}</h3>
            <p className="text-base text-black">{exercise.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ReadingExercises;
