"use client";
import Navbar from "@/components/Navbar";
import CurriculumSection from "@/components/CurriculumSection";
import GenedSection from "@/components/GenedSection";
import SummarySection from "@/components/SummarySection";
import { DndContext } from "@dnd-kit/core";
import { dataSemester, dataCourse } from "@/utilities/dataSemester";
import { useEffect, useState } from "react";
import { useSensor, useSensors, MouseSensor } from "@dnd-kit/core";

export default function Home() {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    })
  );
  const [semester, setSemester] = useState(dataSemester);
  const [course, setCourse] = useState(dataCourse);

  const reset = () => {
    setSemester(dataSemester);
    setCourse(dataCourse);
    window.location.reload();
  };
  return (
    <main className="bg-white w-full h-full font-poppins">
      <Navbar />
      <DndContext
        sensors={sensors}
        onDragEnd={(event) => {
          const { active, over } = event;
          if (
            semester.filter(
              (item) =>
                item.year + "" === over.id[0] &&
                item.semester + "" === over.id[1]
            )[0].dropbox[over.id[2]] ||
            !over
          ) {
            return;
          }

          const overId = over.id[2];
          const activeYear = active.id[0] ? active.id[0] - 0 : 0;
          const activeSemester = active.id[1] ? active.id[1] - 0 : 0;
          const activeId = active.id[2] ? active.id[2] : 0;
          const activeCodeId = active.data.current.codeId;
          console.log("active", active);
          console.log("over", over);
          console.log(
            overId,
            activeYear,
            activeSemester,
            activeId,
            activeCodeId
          );
          setSemester((prevData) =>
            prevData.map((item, index) => {
              if (
                over.data.current.year === item.year &&
                over.data.current.semester === item.semester
              ) {
                console.log(activeId, overId);
                if (
                  over.data.current.year === activeYear &&
                  over.data.current.semester === activeSemester
                ) {
                  return {
                    ...item,
                    dropbox: {
                      ...item.dropbox,
                      [overId]: activeCodeId,
                      [activeId]: null,
                    },
                  };
                }
                return {
                  ...item,
                  dropbox: {
                    ...item.dropbox,
                    [overId]: activeCodeId,
                  },
                };
              } else if (
                activeYear === item.year &&
                activeSemester === item.semester
              ) {
                return {
                  ...item,
                  dropbox: { ...item.dropbox, [activeId]: null },
                };
              } else {
                return { ...item };
              }
            })
          );
          setCourse((prevData) => {
            const newData = { ...prevData };
            const courseToUpdate = newData[activeCodeId];
            if (courseToUpdate) {
              courseToUpdate.dropbox =
                "" +
                over.data.current.year +
                over.data.current.semester +
                overId;
            }

            return newData;
          });
        }}
      >
        <CurriculumSection
          reset={reset}
          semester={semester}
          setSemester-={setSemester}
          course={course}
          setCourse={setCourse}
        />
      </DndContext>
      <GenedSection course={course} />
      <SummarySection />
    </main>
  );
}
