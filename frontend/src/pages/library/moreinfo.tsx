import { useRouter } from "next/router";
import React from "react";

const MoreInfoPage = () => {
  const router = useRouter();
  const { data } = router.query;

  let fileInfo = null;
  try {
    if (data) {
      fileInfo = JSON.parse(data as string);
    }
  } catch (err) {
    console.error("Failed to parse data:", err);
  }

  if (!fileInfo) {
    return <p>Loading or no data available.</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>File Information</h2>
      <p><strong>File Name: </strong> {fileInfo.fileName}</p>
      <p><strong>Title: </strong> {fileInfo.title}</p>
      <p><strong>Theme: </strong> {fileInfo.theme}</p>
      <p><strong>Contractor: </strong> {fileInfo.contractor}</p>
      <p><strong>Description: </strong> {fileInfo.description}</p>
      <p><strong>Submission Date: </strong> {fileInfo.submissionDate.split("T")[0]}</p>
      <p><strong>Is Confidential: </strong> {fileInfo.isConfidential ? "Yes" : "No"}</p>
      <button onClick={() => router.back()}>⬅ Back</button>
    </div>
  );
};

export default MoreInfoPage;
