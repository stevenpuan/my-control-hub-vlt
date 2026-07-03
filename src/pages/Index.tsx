import { Navigate } from "react-router-dom";

// `/` 由 SaaSDirectory 直接負責，此檔保留為相容導向以避免舊連結 404
export default function Index() {
  return <Navigate to="/" replace />;
}
