import React from "react";

interface SwiperSlideProps {
  image: string;
  children: React.ReactNode;
  extra: React.ReactNode;
}

interface SwiperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hideArrowsAndDots?: boolean;
  className?: string;
  loading?: boolean;
}

interface SwiperBasicSlideProps {
  children: React.ReactNode;
}

const SUPABASE_IMAGE_PREFIX =
  "https://zwgovmkukyfqznkspkdm.supabase.co/storage/v1/object/public/menu";

export default function Swiper({
  loading,
  children,
  hideArrowsAndDots = false,
  className,
  ...props
}: SwiperProps) {
  return (
    <div
      className={className ?? "swiper"}
      style={{ display: loading ? "none" : undefined }}
      {...props}
    >
      <div className="swiper-wrapper">{children}</div>
      {!hideArrowsAndDots && (
        <>
          <div className="swiper-button-prev" />
          <div className="swiper-button-next" />
          {/* <div className="swiper-pagination" /> */}
        </>
      )}
    </div>
  );
}

export function SwiperBasicSlide({ children }: SwiperBasicSlideProps) {
  return <div className="swiper-slide">{children}</div>;
}

export function SwiperSlide({
  children,
  extra,
  image,
  ...props
}: SwiperSlideProps) {
  return (
    <div {...props} className="swiper-slide">
      {/* elements with  "swiper-carousel-animate-opacity" class will have animated opacity */}
      <div className="swiper-carousel-animate-opacity">
        <img src={SUPABASE_IMAGE_PREFIX + image} />
        <div className="slide-content">{children}</div>
        {extra}
      </div>
    </div>
  );
}
