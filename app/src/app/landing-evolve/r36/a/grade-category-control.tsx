"use client";

import { CATEGORIES, GRADES, gradeIndex, type CategoryId, type GradeId } from "./data";
import { CAPTION, FOCUS_RING } from "./tokens";

interface ControlProps {
  categoryId: CategoryId;
  gradeId: GradeId;
  onCategoryChange: (id: CategoryId) => void;
  onGradeChange: (id: GradeId) => void;
  idPrefix: string;
}

/**
 * The device's two linked inputs. The select and the slider are both real, fully keyboard-
 * operable native controls -- no custom widget replaces either one's built-in semantics. Moving
 * either control re-renders this component's caller synchronously, which is what drives the
 * slope chart's highlighted row and every downstream readout.
 */
export function GradeCategoryControl({ categoryId, gradeId, onCategoryChange, onGradeChange, idPrefix }: ControlProps) {
  const currentIndex = gradeIndex(gradeId);
  const selectId = `${idPrefix}-category`;
  const sliderId = `${idPrefix}-grade`;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,180px)_1fr] sm:items-start">
      <div>
        <label htmlFor={selectId} className={`block ${CAPTION} text-zinc-500`}>
          Category
        </label>
        <select
          id={selectId}
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value as CategoryId)}
          className={`mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-950 ${FOCUS_RING}`}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor={sliderId} className={`block ${CAPTION} text-zinc-500`}>
            Condition grade
          </label>
          <span className="text-sm font-extrabold text-zinc-950">{GRADES[currentIndex].label}</span>
        </div>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={GRADES.length - 1}
          step={1}
          value={currentIndex}
          onChange={(e) => onGradeChange(GRADES[Number(e.target.value)].id)}
          className="grade-slider-thumb mt-3 block w-full"
          aria-valuetext={GRADES[currentIndex].label}
        />
        <div className="mt-1.5 grid text-[11px] font-semibold text-zinc-500" style={{ gridTemplateColumns: `repeat(${GRADES.length}, 1fr)` }}>
          {GRADES.map((g, i) => (
            <span
              key={g.id}
              className={`${i === 0 ? "text-left" : i === GRADES.length - 1 ? "text-right" : "text-center"} ${
                g.id === gradeId ? "text-teal-700" : ""
              }`}
            >
              {g.label}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .grade-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 24px;
          background: transparent;
          margin: 0;
          cursor: pointer;
        }
        .grade-slider-thumb::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 9999px;
          background: #e4e4e7;
        }
        .grade-slider-thumb::-moz-range-track {
          height: 6px;
          border-radius: 9999px;
          background: #e4e4e7;
        }
        .grade-slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          margin-top: -8px;
          border-radius: 9999px;
          background: #0d9488;
          border: 3px solid #ffffff;
          box-shadow: 0 0 0 1px rgba(24, 24, 27, 0.16), 0 1px 2px rgba(24, 24, 27, 0.2);
        }
        .grade-slider-thumb::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 9999px;
          background: #0d9488;
          border: 3px solid #ffffff;
          box-shadow: 0 0 0 1px rgba(24, 24, 27, 0.16), 0 1px 2px rgba(24, 24, 27, 0.2);
        }
        .grade-slider-thumb:focus-visible::-webkit-slider-thumb {
          outline: 2px solid #0f766e;
          outline-offset: 2px;
        }
        .grade-slider-thumb:focus-visible::-moz-range-thumb {
          outline: 2px solid #0f766e;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
