"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload, GripVertical } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import type { SiteContent, FaqItem, Stat, CollectionItem } from "@/lib/site-content-store";

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Upload failed");
  }
  const { url } = await res.json();
  return url as string;
}

function ImageUploader({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (err: unknown) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    }
    setUploading(false);
    if (ref.current) ref.current.value = "";
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2 items-start">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload below"
          className="flex-1"
        />
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <Button type="button" variant="outline" size="sm" onClick={() => ref.current?.click()} disabled={uploading}>
          <Upload className="h-3.5 w-3.5 mr-1" />
          {uploading ? "..." : "Upload"}
        </Button>
      </div>
      {value && (
        <img src={value} alt={label} className="h-20 w-auto rounded border border-border object-cover" />
      )}
    </div>
  );
}

export default function AdminContentPage() {
  const [saving, setSaving] = useState<string | null>(null);

  const { data, isLoading } = useQuery<SiteContent>({
    queryKey: ["site-content"],
    queryFn: async () => {
      const res = await fetch("/api/site-content");
      if (!res.ok) throw new Error("Failed to load content");
      return res.json();
    },
  });

  // --- Brand state ---
  const [brand, setBrand] = useState(data?.brand ?? {
    name: "", tagline: "", address: "", phone: "", email: "",
    hours: { weekdays: "", saturday: "", sunday: "" },
    social: { instagram: "", facebook: "", twitter: "" },
  });

  // --- Homepage state ---
  const [hero, setHero] = useState(data?.homepage.hero ?? {
    tagline: "", heading: "", description: "", backgroundImage: "",
  });
  const [story, setStory] = useState(data?.homepage.story ?? {
    tagline: "", heading: "", paragraph1: "", paragraph2: "", image: "",
  });
  const [collections, setCollections] = useState<CollectionItem[]>(data?.homepage.collections ?? []);

  // --- About state ---
  const [aboutHeroImage, setAboutHeroImage] = useState(data?.about.heroImage ?? "");
  const [paragraphs, setParagraphs] = useState<string[]>(data?.about.paragraphs ?? [""]);
  const [stats, setStats] = useState<Stat[]>(data?.about.stats ?? []);

  // --- FAQ state ---
  const [faq, setFaq] = useState<FaqItem[]>(data?.faq ?? []);

  // --- SEO state ---
  const [seo, setSeo] = useState(data?.seo ?? {
    title: "", description: "", keywords: [] as string[], ogImage: "",
  });
  const [keywordsInput, setKeywordsInput] = useState(data?.seo.keywords.join(", ") ?? "");

  // Sync state once data loads
  useEffect(() => {
    if (!data) return;
    setBrand(data.brand);
    setHero(data.homepage.hero);
    setStory(data.homepage.story);
    setCollections(data.homepage.collections);
    setAboutHeroImage(data.about.heroImage);
    setParagraphs(data.about.paragraphs.length ? data.about.paragraphs : [""]);
    setStats(data.about.stats);
    setFaq(data.faq);
    setSeo(data.seo);
    setKeywordsInput(data.seo.keywords.join(", "));
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (payload: Partial<SiteContent>) => {
      const res = await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Save failed");
      }
    },
    onSuccess: () => toast({ title: "Saved successfully" }),
    onError: (e: Error) => toast({ title: "Save failed", description: e.message, variant: "destructive" }),
    onSettled: () => setSaving(null),
  });

  const save = (tab: string, payload: Partial<SiteContent>) => {
    setSaving(tab);
    saveMutation.mutate(payload);
  };

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-foreground">Site Content</h1>

      <Tabs defaultValue="brand">
        <div className="overflow-x-auto pb-1">
        <TabsList className="mb-6 w-max">
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>
        </div>

        {/* ─── BRAND ─── */}
        <TabsContent value="brand" className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand Name</Label>
              <Input value={brand.name} onChange={(e) => setBrand({ ...brand, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={brand.phone} onChange={(e) => setBrand({ ...brand, phone: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input value={brand.tagline} onChange={(e) => setBrand({ ...brand, tagline: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={brand.email} onChange={(e) => setBrand({ ...brand, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea value={brand.address} onChange={(e) => setBrand({ ...brand, address: e.target.value })} rows={2} />
          </div>
          <fieldset className="border border-border rounded-md p-4 space-y-3">
            <legend className="text-sm font-medium px-1">Business Hours</legend>
            <div className="space-y-2">
              <Label>Weekdays</Label>
              <Input value={brand.hours.weekdays} onChange={(e) => setBrand({ ...brand, hours: { ...brand.hours, weekdays: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>Saturday</Label>
              <Input value={brand.hours.saturday} onChange={(e) => setBrand({ ...brand, hours: { ...brand.hours, saturday: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>Sunday</Label>
              <Input value={brand.hours.sunday} onChange={(e) => setBrand({ ...brand, hours: { ...brand.hours, sunday: e.target.value } })} />
            </div>
          </fieldset>
          <fieldset className="border border-border rounded-md p-4 space-y-3">
            <legend className="text-sm font-medium px-1">Social Links</legend>
            <div className="space-y-2">
              <Label>Instagram URL</Label>
              <Input value={brand.social.instagram} placeholder="https://instagram.com/..." onChange={(e) => setBrand({ ...brand, social: { ...brand.social, instagram: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>Facebook URL</Label>
              <Input value={brand.social.facebook} placeholder="https://facebook.com/..." onChange={(e) => setBrand({ ...brand, social: { ...brand.social, facebook: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>Twitter / X URL</Label>
              <Input value={brand.social.twitter} placeholder="https://twitter.com/..." onChange={(e) => setBrand({ ...brand, social: { ...brand.social, twitter: e.target.value } })} />
            </div>
          </fieldset>
          <Button onClick={() => save("brand", { brand })} disabled={saving === "brand"}>
            {saving === "brand" ? "Saving..." : "Save Brand"}
          </Button>
        </TabsContent>

        {/* ─── HOMEPAGE ─── */}
        <TabsContent value="homepage" className="space-y-8 max-w-2xl">
          <fieldset className="border border-border rounded-md p-4 space-y-4">
            <legend className="text-sm font-medium px-1">Hero Section</legend>
            <div className="space-y-2">
              <Label>Tagline (small text above heading)</Label>
              <Input value={hero.tagline} onChange={(e) => setHero({ ...hero, tagline: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input value={hero.heading} onChange={(e) => setHero({ ...hero, heading: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} rows={3} />
            </div>
            <ImageUploader label="Background Image" value={hero.backgroundImage} onChange={(url) => setHero({ ...hero, backgroundImage: url })} />
          </fieldset>

          <fieldset className="border border-border rounded-md p-4 space-y-4">
            <legend className="text-sm font-medium px-1">Our Story Section</legend>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input value={story.tagline} onChange={(e) => setStory({ ...story, tagline: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input value={story.heading} onChange={(e) => setStory({ ...story, heading: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Paragraph 1</Label>
              <Textarea value={story.paragraph1} onChange={(e) => setStory({ ...story, paragraph1: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Paragraph 2</Label>
              <Textarea value={story.paragraph2} onChange={(e) => setStory({ ...story, paragraph2: e.target.value })} rows={3} />
            </div>
            <ImageUploader label="Story Image" value={story.image} onChange={(url) => setStory({ ...story, image: url })} />
          </fieldset>

          <fieldset className="border border-border rounded-md p-4 space-y-4">
            <legend className="text-sm font-medium px-1">Collection Images</legend>
            {collections.map((col, i) => (
              <ImageUploader
                key={col.slug}
                label={`${col.label} Image`}
                value={col.image}
                onChange={(url) => {
                  const updated = [...collections];
                  updated[i] = { ...col, image: url };
                  setCollections(updated);
                }}
              />
            ))}
          </fieldset>

          <Button
            onClick={() => save("homepage", { homepage: { hero, collections, story } })}
            disabled={saving === "homepage"}
          >
            {saving === "homepage" ? "Saving..." : "Save Homepage"}
          </Button>
        </TabsContent>

        {/* ─── ABOUT ─── */}
        <TabsContent value="about" className="space-y-6 max-w-2xl">
          <ImageUploader label="Hero Image" value={aboutHeroImage} onChange={setAboutHeroImage} />

          <div className="space-y-3">
            <Label>Paragraphs</Label>
            {paragraphs.map((p, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Textarea
                  value={p}
                  onChange={(e) => {
                    const updated = [...paragraphs];
                    updated[i] = e.target.value;
                    setParagraphs(updated);
                  }}
                  rows={3}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setParagraphs(paragraphs.filter((_, idx) => idx !== i))}
                  disabled={paragraphs.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setParagraphs([...paragraphs, ""])}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Paragraph
            </Button>
          </div>

          <div className="space-y-3">
            <Label>Stats (optional highlight numbers)</Label>
            {stats.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input
                  value={s.num}
                  placeholder="e.g. 500+"
                  onChange={(e) => {
                    const updated = [...stats];
                    updated[i] = { ...s, num: e.target.value };
                    setStats(updated);
                  }}
                  className="w-24"
                />
                <Input
                  value={s.label}
                  placeholder="e.g. Pieces Crafted"
                  onChange={(e) => {
                    const updated = [...stats];
                    updated[i] = { ...s, label: e.target.value };
                    setStats(updated);
                  }}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setStats(stats.filter((_, idx) => idx !== i))}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setStats([...stats, { num: "", label: "" }])}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Stat
            </Button>
          </div>

          <Button
            onClick={() => save("about", { about: { heroImage: aboutHeroImage, paragraphs, stats } })}
            disabled={saving === "about"}
          >
            {saving === "about" ? "Saving..." : "Save About"}
          </Button>
        </TabsContent>

        {/* ─── FAQ ─── */}
        <TabsContent value="faq" className="space-y-4 max-w-2xl">
          {faq.map((item, i) => (
            <div key={i} className="border border-border rounded-md p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Question {i + 1}</span>
                <Button type="button" variant="ghost" size="icon" onClick={() => setFaq(faq.filter((_, idx) => idx !== i))}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  value={item.question}
                  onChange={(e) => {
                    const updated = [...faq];
                    updated[i] = { ...item, question: e.target.value };
                    setFaq(updated);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea
                  value={item.answer}
                  rows={3}
                  onChange={(e) => {
                    const updated = [...faq];
                    updated[i] = { ...item, answer: e.target.value };
                    setFaq(updated);
                  }}
                />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => setFaq([...faq, { question: "", answer: "" }])}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Add FAQ Item
          </Button>
          <div>
            <Button onClick={() => save("faq", { faq })} disabled={saving === "faq"}>
              {saving === "faq" ? "Saving..." : "Save FAQ"}
            </Button>
          </div>
        </TabsContent>

        {/* ─── SEO ─── */}
        <TabsContent value="seo" className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <Label>Page Title</Label>
            <Input value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} />
            <p className="text-xs text-muted-foreground">Shown in browser tab and search results. {seo.title.length}/200 chars.</p>
          </div>
          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Textarea value={seo.description} onChange={(e) => setSeo({ ...seo, description: e.target.value })} rows={3} />
            <p className="text-xs text-muted-foreground">Search result snippet. {seo.description.length}/160 chars recommended.</p>
          </div>
          <div className="space-y-2">
            <Label>Keywords (comma-separated)</Label>
            <Input
              value={keywordsInput}
              onChange={(e) => {
                setKeywordsInput(e.target.value);
                setSeo({ ...seo, keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean) });
              }}
              placeholder="gold jewelry, handcrafted, Abuja"
            />
          </div>
          <ImageUploader label="OG Image (social share preview)" value={seo.ogImage} onChange={(url) => setSeo({ ...seo, ogImage: url })} />
          <Button onClick={() => save("seo", { seo })} disabled={saving === "seo"}>
            {saving === "seo" ? "Saving..." : "Save SEO"}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
