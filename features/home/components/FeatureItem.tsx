import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

const FEATURED_DESTINATION_KEYS = [
  "Brazil",
  "England",
  "France",
  "Australia",
  "California",
  "Germany",
  "HongKong",
  "India",
] as const;

type FeaturedDestinationKey = (typeof FEATURED_DESTINATION_KEYS)[number];

function isFeaturedDestinationKey(
  value: string,
): value is FeaturedDestinationKey {
  return (FEATURED_DESTINATION_KEYS as readonly string[]).includes(value);
}

type FeatureItemProps = {
  URL: string;
  title: string;
};

const FeatureItem = ({ URL, title }: FeatureItemProps) => {
  const tServices = useTranslations("home.services");
  const tDestinations = useTranslations("home.services.featuredDestinations");
  const displayTitle =
    isFeaturedDestinationKey(title) && tDestinations.has(title)
      ? tDestinations(title)
      : title;

  return (
    <div className="mx-4 group">
      <Link
        href="/#packages"
        className="overflow-hidden relative block"
        aria-label={tServices("featureAria", { destination: displayTitle })}
      >
        <div>
          <Image
            src={URL}
            alt={displayTitle}
            height={600}
            width={510}
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={90}
            className="rounded-lg lg:rounded-xl shadow-lg transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
          <h4 className="capitalize absolute top-6 start-4 bg-black/60 text-white text-sm sm:text-base lg:text-lg font-semibold rounded-lg px-4 py-2 transition-opacity duration-300 group-hover:bg-secondary shadow-lg">
            {displayTitle}
          </h4>
        </div>
      </Link>
    </div>
  );
};

export default FeatureItem;
