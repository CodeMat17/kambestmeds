export type Product = {
  image: string;
  name: string;
  cures: string;
  instructions?: string;
  amount: string;
};

// Normalized shape ProductCard renders — works for both the legacy static
// catalogue and products managed in the dashboard (Convex storage URLs).
export type ProductView = {
  key: string;
  src: string;
  video: boolean;
  name: string;
  cures: string;
  instructions?: string;
  amount: string;
};

export const products: Product[] = [
  { image: "1000421943.jpg", name: "Fibroid Cure", cures: "Fibroid Intramural, Subserosal, Submucosa, Cervical, Heavy painful period, Lower back pain, Pains during intercourse, Fertility problem", amount: "5000" },
  { image: "1000423355.jpg", name: "Kambest Tradomedical Centre", cures: "General herbal treatments as indicated by the logo and slogan 'Rooted in Nature. Proven in Results.'", amount: "5000" },
  { image: "1000423439.jpg", name: "Herbal Capsules", cures: "Specific cures not listed on this image", amount: "5000" },
  { image: "1000423441.jpg", name: "Kambest Trado Medical Services", cures: "Herbal Remedies, Herbal Supplements, Cosmetics and Personal Care", amount: "5000" },
  { image: "1000423443.jpg", name: "Kambest Trado Medical Services Logo", cures: "Specific cures not listed on this image", amount: "5000" },
  { image: "1000423669.jpg", name: "Hepatitis & Liver Detox", cures: "Hepatitis, Liver Diseases, Liver Cell Jaundice, Hemolytic Jaundice, Palliation, General Liver & Kidney Detoxification, Kidney Disease, Kidney Stones, Enhance Bile Secretion, Dissolves Liver Fat, Treats Gallbladder, Treats The Endocrine System and Supports Immune System", amount: "5000" },
  { image: "1000423671.jpg", name: "Fibroid Cure", cures: "Fibroid Intramural, Subserosal, Submucosa, Cervical, Heavy Painful Period, Lower Back Pain, Pains During Inter Cours & Fertility Problem", amount: "5000" },
  { image: "1000423672.jpg", name: "Sperm Booster", cures: "Low sperm count, Oligospermia, Azospermia, Low vitality, Watery sperms, Motility Rate, Fertility in men, Restore urge and feeling of sex satisfaction", amount: "5000" },
  { image: "1000423674.jpg", name: "Hepatitis & Liver Detox", cures: "Hepatitis, Liver Diseases, Liver Cell Jaundice, Hemolytic Jaundice, Palliation, General Liver & Kidney Detoxification, Kidney Disease, Kidney Stones, Enhance Bile Secretion, Dissolves Liver Fat, Treats Gallbladder, Supports Endocrine System, Strengthens & Supports Immune System", amount: "5000" },
  { image: "1000423675.jpg", name: "BP & Cholesterol", cures: "Hypertension, Diabetes, Bronchial Problems, Colds, Bruises, Boils, Ear-aches, Swelling Arthritis, Sprains, Relieves Colds, Asthma, Tay-tay Worms, Shortness of Breath", amount: "5000" },
  { image: "1000423690.jpg", name: "BP & Cholesterol", cures: "Hypertension, Diabetes, Bronchial Problems, Colds, Bruises, Boils, Ear-aches, Swelling Arthritis, Sprains, Relieves Colds, Asthma, Tay-tay Worms, Shortness of Breath", amount: "5000" },
  { image: "1000423691.jpg", name: "Fibroid Cure", cures: "Fibroid Intramural, Subserosal, Submucosa, Cervical, Heavy painful period, Lower back pain, Pains during intercourse, Fertility problem", amount: "5000" },
  { image: "1000423692.jpg", name: "Hepatitis & Liver Detox", cures: "Hepatitis, Liver Diseases, Liver Cell Jaundice, Hemolytic Jaundice, Palliation, General Liver & Kidney Detoxification, Kidney Disease, Kidney Stones, Enhance Bile Secretion, Dissolves Liver Fat, Treats Gallbladder, Supports Endocrine System, Strengthens & Supports Immune System", amount: "5000" },
  { image: "1000423693.jpg", name: "Sperm Booster", cures: "Low sperm count, Oligospermia, Azospermia, Low vitality, Watery sperms, Motility Rate, Fertility in men, Restore urge and feeling of sex satisfaction", amount: "5000" },
  { image: "1000423694.jpg", name: "BP & Cholesterol", cures: "Hypertension, Diabetes, Bronchial Problems, Colds, Bruises, Boils, Ear-aches, Swelling Arthritis, Sprains, Relieves Colds, Asthma, Tay-tay Worms, Shortness of Breath", amount: "5000" },
  { image: "1000423695.jpg", name: "Fibroid Cure", cures: "Fibroid Intramural, Subserosal, Submucosa, Cervical, Heavy Painful Period, Lower Back Pain, Pains During Inter Cours & Fertility Problem", amount: "5000" },
  { image: "1000423696.jpg", name: "Hepatitis & Liver Detox", cures: "Hepatitis, Liver Diseases, Liver Cell Jaundice, Hemolytic Jaundice, Palliation, General Liver & Kidney Detoxification, Kidney Disease, Kidney Stones, Enhance Bile Secretion, Dissolves Liver Fat, Treats Gallbladder, Treats The Endocrine System and Supports Immune System", amount: "5000" },
  { image: "1000423698.jpg", name: "BP & Cholesterol", cures: "Hypertension, Diabetes, Bronchial Problems, Colds, Bruises, Boils, Ear-aches, Swelling Arthritis, Sprains, Relieves Colds, Asthma, Tay-tay Worms, Shortness of Breath", amount: "5000" },
  { image: "1000423701.mp4", name: "Staphylococcus Wiper", cures: "Staphylococcus aureus, candidiasis, white milk discharge, breast milk discharge, itching, infertility (both male and female), toilet infection", amount: "5000" },
];

export function isVideo(image: string) {
  return image.toLowerCase().endsWith(".mp4");
}

export function formatNaira(amount: string) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}
