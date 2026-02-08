// src/pages/work/ChecklistPage.tsx
import { useParams } from "react-router-dom";
import TyreChecklist from "../../components/work/work-details/checklists/TyreCheckList";
import AlignmentChecklist from "../../components/work/work-details/checklists/AlignmentCheckList";
import BalancingChecklist from "../../components/work/work-details/checklists/BalancingChecklist";
import PUCOperatorChecklist from "../../components/work/work-details/checklists/PucOperatorCheckList";
import CarwashChecklist from "../../components/work/work-details/checklists/CarwashChecklist";


const checklistMap: Record<
  string,
  {
    component: React.ComponentType<{ enquiryId: string }>;
    title: string;
  }
> = {
  "tyre-technician-checklist": {
    component: TyreChecklist,
    title: "Tyre Technician Checklist",
  },
  "alignment-technician-checklist": {
    component: AlignmentChecklist,
    title: "Alignment Technician Checklist",
  },
  "balancing-technician-checklist": {
    component: BalancingChecklist,
    title: "Balancing Technician Checklist",
  },
  "puc-operator-checklist": {
    component: PUCOperatorChecklist,
    title: "PUC Operator Checklist",
  },
  "car-wash-checklist": {
    component: CarwashChecklist,
    title: "Car Wash Checklist",
  },
  // Add more when you create Battery / Oil checklists
  // "battery-checklist": { component: BatteryChecklist, title: "Battery Check" },
};

const ChecklistPage = () => {
  const { id: enquiryId, checklistType } = useParams<{
    id: string;
    checklistType: string;
  }>();

  // Guard: missing params
  if (!enquiryId || !checklistType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600 text-lg">
          Invalid URL — missing enquiry ID or checklist type
        </div>
      </div>
    );
  }

  // Find the matching checklist
  const checklist = checklistMap[checklistType.toLowerCase()];

  if (!checklist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-700 text-lg">
          Checklist type not found: <strong>{checklistType}</strong>
        </div>
      </div>
    );
  }

  const ChecklistComponent = checklist.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Optional header / breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Render the actual checklist component */}
        <ChecklistComponent enquiryId={enquiryId} />
      </div>
    </div>
  );
};

export default ChecklistPage;