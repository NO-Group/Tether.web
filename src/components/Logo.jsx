import { APP_NAME } from '../config.js';

export default function Logo({ size = 40 }) {
  return (
    <img
      className="brand-logo"
      src={`${import.meta.env.BASE_URL}logo.svg`}
      alt={`${APP_NAME} logo`}
      width={size}
      height={size}
    />
  );
}
