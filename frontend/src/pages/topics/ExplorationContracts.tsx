import React from "react";
import ExplorationContracts from "../../components/topics/ExplorationContractsTemplate";
import { useLanguage } from "../../contexts/languageContext";

export default function ExplorationContractsPage() {
  const { t } = useLanguage();
  return <ExplorationContracts t={t} />;
}