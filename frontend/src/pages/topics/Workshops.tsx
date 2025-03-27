import React from "react";
import Workshops from "../../components/topics/WorkshopsTemplate";
import { useLanguage } from "../../contexts/languageContext";

export default function WorkshopsPage() {
  const { t } = useLanguage();
  return <Workshops t={t} />;
}