import type { Metadata } from "next";
import BlogClient from "../components/BlogClient";

export const metadata: Metadata = {
  title: "The PhoneBhai Journal | Tech, Phones & Buying Guides",
  description:
    "Explore smartphone buying guides, comparisons, technology trends and practical tips from the PhoneBhai Journal.",
};

export default function BlogPage() {
  return <BlogClient />;
}
