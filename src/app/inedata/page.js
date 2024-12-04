import CameraINE from "@/sections/captureINE/CameraINE";
import CameraOpenCV from "@/sections/captureINE/CameraOpenCV";
export default function INEDataPage() {
  return (
    <div >
      <CameraINE />
      <CameraOpenCV />

    </div>

  );
}