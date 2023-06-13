import { memo } from "react";

interface StatusButtonProps {
  isActive: boolean;
}
export const StatusButton = memo(function StatusBtn({
  isActive,
}: StatusButtonProps) {
  return (
    <div
      className={
        "status-button w-[60px] max-h-[20px] h-[20px] rounded flex items-center text-white"
      }
      style={{ margin: "auto" }}
    >
      <div
        className={`px-[10px] py-[4px] flex-1 flex items-center justify-center rounded status-text ${
          isActive ? "bg-s-active" : "bg-s-inactive"
        }`}
      >{`${isActive ? "Active" : "Inactive"}`}</div>
    </div>
  );
});
