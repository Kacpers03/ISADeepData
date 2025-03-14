import React from 'react';
import Head from 'next/head';
import GalleryTemplate from '../components/gallery/galleryTemplate';

const GalleryPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Gallery | ISA DeepData</title>
        <meta name="description" content="Browse deep-sea images and videos from the ISA DeepData gallery" />
      </Head>
      
      <GalleryTemplate />
    </>
  );
};

export default GalleryPage;