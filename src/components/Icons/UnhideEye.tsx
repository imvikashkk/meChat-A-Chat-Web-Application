import * as React from "react"
const SvgComponent = (props:any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#999"
      d="m5.707 19.707 14-14a1 1 0 0 0-1.414-1.414l-14 14a1 1 0 1 0 1.414 1.414ZM12 5c1.201 0 2.394.214 3.536.635l-1.6 1.6A8.137 8.137 0 0 0 12 7c-2.927 0-5.931 1.596-7.908 4.949.654 1.15 1.43 2.097 2.282 2.848l-1.416 1.416c-1.071-.965-2.023-2.176-2.798-3.625a1.376 1.376 0 0 1 .01-1.307C4.458 7.15 8.188 5 12 5Z"
    />
    <path
      fill="#999"
      d="M12 9c.056 0 .112.002.167.005l-3.162 3.162A3 3 0 0 1 12 9ZM14.995 11.833l-3.162 3.162a3 3 0 0 0 3.162-3.162Z"
    />
    <path
      fill="#999"
      d="M12 17a8.047 8.047 0 0 1-1.935-.237L8.468 18.36c1.14.425 2.332.64 3.532.64 3.837 0 7.588-2.199 9.84-6.412a1.376 1.376 0 0 0-.01-1.307c-.776-1.4-1.717-2.573-2.771-3.511l-1.417 1.416c.842.732 1.61 1.65 2.266 2.763C17.96 15.372 14.94 17 12 17Z"
    />
  </svg>
)
export default SvgComponent
