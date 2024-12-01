import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { SpotterImagePreviewData } from "../types/layouts/image-preview";
import { SpotterData, SpotterLayout } from "../types/layouts/layouts";
import { SpotterItem } from "../types/others/action-menu";

export function useSpotterImagePreview(spotterData: SpotterData): SpotterLayout {
  const { imageSources, actionMenu, initialIndex } = spotterData as SpotterImagePreviewData;

  const [index, setIndex] = useState(initialIndex ?? 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIndex(initialIndex ?? 0);
    setError(null);
  }, [imageSources, initialIndex]);

  const handleImageError = () => {
    setError("Image not found");
  };

  const nextImage = () => {
    setIndex((prevIndex) => (prevIndex + 1) % imageSources.length);
    setError(null);
  };

  const prevImage = () => {
    setIndex((prevIndex) => (prevIndex - 1 + imageSources.length) % imageSources.length);
    setError(null);
  };

  const imageSource = imageSources[index];

  const outerBody = (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 w-full h-full relative"
        >
          {error ? (
            <div className="flex items-center justify-center w-full h-full text-red-500">{error}</div>
          ) : (
            <Image
              src={imageSource}
              alt={`Image ${index + 1}`}
              layout="fill"
              objectFit="contain"
              onError={handleImageError}
            />
          )}
        </motion.div>
      </AnimatePresence>
      <motion.div
        key={`blur-${index}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute flex-1 w-full h-full blur-sm -z-10"
        style={{
          backgroundImage: `url(${imageSource})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat"
        }}
      />
    </>
  );

  const actionMenuItems: SpotterItem[] = [...(actionMenu?.items || [])];

  if (index !== imageSources.length - 1) {
    actionMenuItems.unshift({
      type: "Action",
      id: "next-image",
      title: "Next",
      onAction: nextImage,
      isPrimary: true,
      shortcut: "RightPage"
    });
  }

  if (index > 0) {
    actionMenuItems.unshift({
      type: "Action",
      id: "prev-image",
      title: "Previous",
      onAction: prevImage,
      isPrimary: true,
      shortcut: "LeftPage"
    });
  }

  return {
    outerBody,
    actionMenu: {
      title: actionMenu?.title ?? "Image Preview",
      items: actionMenuItems
    }
  };
}
