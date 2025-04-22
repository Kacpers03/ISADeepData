// frontend/src/pages/library/moreinfo.tsx
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MediaInfoTemplate from "../../components/files/mediaInfoTemplate";
import Head from "next/head";
import { FileInfo } from "../../types/fileTypes";

const MoreInfoPage = () => {
  const router = useRouter();
  const { data } = router.query;
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only try to parse the data once it's available from the router
    if (data) {
      try {
        const parsedData = JSON.parse(data as string);
        
        // If we have contractor, area or block IDs but not the full objects,
        // we could fetch them here from the API
        // This is a placeholder for potential API integration
        if (parsedData.contractorId && !parsedData.contractorObj) {
          // Fetch contractor data if needed
          // const fetchContractorData = async () => {
          //   try {
          //     const response = await fetch(`/api/contractors/${parsedData.contractorId}`);
          //     const contractorData = await response.json();
          //     parsedData.contractorObj = contractorData;
          //     setFileInfo({...parsedData});
          //   } catch (error) {
          //     console.error("Error fetching contractor data:", error);
          //   }
          // };
          // fetchContractorData();
        }
        
        setFileInfo(parsedData);
      } catch (err) {
        console.error("Failed to parse data:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [data]);

  if (loading && !fileInfo) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <p>Loading file information...</p>
      </div>
    );
  }

  if (!fileInfo) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f8fafc',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <p>No file information available.</p>
        <button 
          onClick={() => router.push('/library/reports')}
          style={{
            background: '#0284c7',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Return to Files
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{fileInfo.title ? `${fileInfo.title} | ISA DeepData` : 'File Information | ISA DeepData'}</title>
      </Head>
      <MediaInfoTemplate fileInfo={fileInfo} />
    </>
  );
};

export default MoreInfoPage;