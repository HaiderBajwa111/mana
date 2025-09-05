export interface JobRequest {
  id: string;
  fileName: string;
  thumbnailUrl: string;
  material: string;
  color: string;
  quantity: number;
  estimatedTime: string;
  budget: string;
}

export interface MakerStats {
  jobsInProgress: number;
  completedJobs: number;
  avgTurnaround: string;
  earnedThisMonth: number;
}

export interface PrinterSummary {
  name: string;
  buildVolume: string;
  isOnline: boolean;
  materials: string[];
}

export const jobRequests: JobRequest[] = [
  {
    id: "job-1",
    fileName: "drone-chassis-v3.stl",
    thumbnailUrl: "/assets/images/products/futuristic-3d-printed-drone-frame.png",
    material: "PLA",
    color: "Matte Black",
    quantity: 1,
    estimatedTime: "8h 30m",
    budget: "$45.00",
  },
  {
    id: "job-2",
    fileName: "voronoi-lamp-shade.stl",
    thumbnailUrl: "/assets/images/products/futuristic-voronoi-lamp.png",
    material: "PETG",
    color: "Translucent White",
    quantity: 2,
    estimatedTime: "12h 15m",
    budget: "Quote Needed",
  },
  {
    id: "job-3",
    fileName: "cyber-arm-mount.stl",
    thumbnailUrl: "/assets/images/products/futuristic-cybernetic-arm-mount.png",
    material: "ABS",
    color: "Gunmetal Gray",
    quantity: 1,
    estimatedTime: "6h 45m",
    budget: "$32.50",
  },
];

export const makerStats: MakerStats = {
  jobsInProgress: 3,
  completedJobs: 18,
  avgTurnaround: "2.5 days",
  earnedThisMonth: 1245.5,
};

export const printerSummary: PrinterSummary = {
  name: "Prusa MK4",
  buildVolume: "250x210x220 mm",
  isOnline: true,
  materials: ["PLA", "PETG", "ABS", "ASA", "Flex"],
};
