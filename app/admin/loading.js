import {
  LoaderCircle,
} from "lucide-react";


export default function AdminLoading() {

  return (

    <div className="profile-loading">

      <LoaderCircle
        size={30}
        className="analysis-spinner"
      />

      Loading SafeTalkAI...

    </div>

  );
}