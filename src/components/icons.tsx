import { LucideProps, User } from "lucide-react";

export const Icons = {
  user: User,
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      {...props}
    >
      <circle cx="60" cy="60" r="60" fill="#2A5284" />
      <path
        d="M75.6122 19H87L65.5956 47.4175H84.8038L38.9212 101L53.7634 63.14H37L53.9027 19L75.6122 19Z"
        fill="white"
        fill-opacity="0.704"
      />
      <path
        d="M75.6122 19H76.2978L57.0595 51.6479H74.6516L38.9212 100.996L53.7634 63.14H37L53.9027 19L75.6122 19Z"
        fill="white"
      />
    </svg>
  ),
};
