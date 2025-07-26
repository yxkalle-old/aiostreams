'use client';
import { PageWrapper } from '../shared/page-wrapper';
import { useStatus } from '@/context/status';
import { SettingsCard } from '../shared/settings-card';
import { Alert } from '@/components/ui/alert';
import { Button, IconButton } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import {
  InfoIcon,
  GithubIcon,
  BookOpenIcon,
  HeartIcon,
  CoffeeIcon,
  MessageCircleIcon,
  PencilIcon,
} from 'lucide-react';
import { FaGithub, FaDiscord } from 'react-icons/fa';
import { BiDonateHeart } from 'react-icons/bi';
import { AiOutlineDiscord } from 'react-icons/ai';
import { FiGithub } from 'react-icons/fi';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Skeleton } from '@/components/ui/skeleton';
import { useDisclosure } from '@/hooks/disclosure';
import { Modal } from '../ui/modal';
import { SiGithubsponsors, SiKofi } from 'react-icons/si';
import { useUserData } from '@/context/userData';
import { toast } from 'sonner';
import { useMenu } from '@/context/menu';
import { DonationModal } from '../shared/donation-modal';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { cn } from '@/components/ui/core/styling';
import { Textarea } from '../ui/textarea';
import { GlowingEffect } from '../shared/glowing-effect';

export function AboutMenu() {
  return (
    <>
      <PageWrapper className="space-y-4 p-4 sm:p-8">
        <Content />
      </PageWrapper>
    </>
  );
}

function Content() {
  const { status, loading, error } = useStatus();
  const { nextMenu } = useMenu();
  const { userData, setUserData } = useUserData();
  const addonName =
    userData.addonName || status?.settings?.addonName || 'AIOStreams';
  const defaultDescription = `
  AIOStreams consolidates multiple Stremio addons and debrid
  services into a single, easily configurable addon. It allows
  highly customisable filtering, sorting, and formatting of results
  and supports proxying all your streams through MediaFlow Proxy or
  StremThru for improved compatibility and IP restriction bypassing.
  `;
  const addonDescription = userData.addonDescription || defaultDescription;
  const version = status?.tag || 'Unknown';
  const githubUrl = 'https://github.com/Viren070/AIOStreams';
  const releasesUrl = 'https://github.com/Viren070/AIOStreams/releases';
  const stremioGuideUrl = 'https://guides.viren070.me/stremio/';
  const configGuideUrl = 'https://guides.viren070.me/stremio/addons/aiostreams';
  const discordUrl = 'https://discord.viren070.me';
  const donationModal = useDisclosure(false);
  const customizeModal = useDisclosure(false);
  const customHtml = status?.settings?.customHtml;

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {/* Top section: Responsive logo/name/about layout */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start w-full relative">
          {/* Donate button - visible only on larger screens */}
          <div className="hidden lg:block absolute top-0 right-0">
            <Button
              intent="alert-subtle"
              size="md"
              leftIcon={<HeartIcon />}
              onClick={donationModal.open}
            >
              Support Me
            </Button>
          </div>

          {/* Large logo left */}
          <div className="flex-shrink-0 flex justify-center md:justify-start w-full md:w-auto">
            <Image
              src={userData.addonLogo || '/logo.png'}
              alt="Logo"
              width={140}
              height={112}
              className="rounded-lg shadow-lg"
            />
          </div>
          {/* Name, version, about right */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col md:flex-row md:items-end md:gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-3xl md:text-4xl font-bold tracking-tight text-gray-100 truncate">
                  {addonName}
                </span>
                <IconButton
                  icon={<PencilIcon className="w-4 h-4" />}
                  intent="primary-subtle"
                  onClick={customizeModal.open}
                  className="rounded-full flex-shrink-0"
                  size="sm"
                />
              </div>
              <span className="text-xl md:text-2xl font-semibold text-gray-400 md:mb-1">
                {version}{' '}
                {/* {version.includes('nightly') ? `(${status?.commit})` : ''} */}
                {version.includes('nightly') ? (
                  <a
                    href={`https://github.com/Viren070/AIOStreams/commit/${status?.commit}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[--brand] hover:underline"
                  >
                    ({status?.commit})
                  </a>
                ) : null}
              </span>
            </div>
            <div className="text-base md:text-lg text-[--muted] font-medium mb-2">
              {addonDescription}
            </div>
          </div>
        </div>
        {/* Custom HTML section, styled like a card, only if present */}
        {customHtml && (
          <SettingsCard>
            <div
              className="[&_a]:text-[--brand] [&_a:hover]:underline"
              dangerouslySetInnerHTML={{ __html: customHtml }}
            />
          </SettingsCard>
        )}

        {/* Main content: Getting Started */}
        <SettingsCard
          title="Get Started"
          description="Everything you need to know about AIOStreams"
          className="mt-4"
        >
          <div className="space-y-6">
            {/* Welcome section */}
            <div className="text-base text-muted-foreground">
              <b>Welcome to AIOStreams!</b> <br />
              <br />
              <span>
                Click the Configure button below to start customizing AIOStreams
                to your preferences. You'll be guided through each section where
                you can set up your configuration. Once complete, you'll create
                a password-protected configuration that you can install in
                Stremio or other compatible apps.
              </span>
              <br />
              <br />
              <span>
                Need to make changes later? Simply click configure within your
                app and enter your password. You can update your settings at any
                time, and in most cases - you won't need to reinstall
                AIOStreams!
              </span>
            </div>

            <div className="flex items-center justify-center mb-6">
              <Button
                intent="white"
                size="lg"
                rounded
                // className="px-8 py-2.5 font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
                onClick={() => {
                  nextMenu();
                }}
              >
                Configure
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
            </div>

            {/* Quick links grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <a
                href={configGuideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 p-4 rounded-lg bg-gray-900/40 hover:bg-gray-900/60 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex items-center gap-2 text-[--brand] group-hover:underline">
                  <BookOpenIcon className="w-5 h-5" />
                  <span className="font-semibold">Configuration Guide</span>
                </div>
                <p className="text-sm text-muted-foreground group-hover:text-gray-300 transition-colors">
                  Learn how to configure AIOStreams to get the most out of your
                  streaming experience
                </p>
              </a>

              <a
                href="https://github.com/Viren070/AIOStreams/wiki"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 p-4 rounded-lg bg-gray-900/40 hover:bg-gray-900/60 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex items-center gap-2 text-[--brand] group-hover:underline">
                  <BookOpenIcon className="w-5 h-5" />
                  <span className="font-semibold">Wiki</span>
                </div>
                <p className="text-sm text-muted-foreground group-hover:text-gray-300 transition-colors">
                  Browse our comprehensive documentation for advanced features
                  like the Custom Formatter and Group conditions.
                </p>
              </a>

              <a
                href={stremioGuideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 p-4 rounded-lg bg-gray-900/40 hover:bg-gray-900/60 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex items-center gap-2 text-[--brand] group-hover:underline">
                  <InfoIcon className="w-5 h-5" />
                  <span className="font-semibold">Stremio Guide</span>
                </div>
                <p className="text-sm text-muted-foreground group-hover:text-gray-300 transition-colors">
                  New to Stremio and its addons? Go through my Stremio guide to
                  get started!
                </p>
              </a>
            </div>
          </div>
        </SettingsCard>

        {/* What's New section in its own row */}
        <div className="mt-4">
          <ChangelogBox version={version} />
        </div>

        {/* Social & donation row */}
        <div className="flex flex-col items-center mt-4">
          <div className="flex gap-6 flex-wrap items-center justify-center">
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Join Discord"
              className="text-gray-400 hover:text-[--brand] transition-colors"
            >
              <AiOutlineDiscord className="w-7 h-7" />
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="text-gray-400 hover:text-[--brand] transition-colors"
            >
              <FiGithub className="w-7 h-7" />
            </a>
            <a
              onClick={donationModal.open}
              title="Support me"
              className="text-gray-400 hover:text-[--brand] cursor-pointer transition-colors"
            >
              <CoffeeIcon className="w-7 h-7" />
            </a>
          </div>
          <div className="flex flex-col items-center gap-0.5 mt-4 text-xs text-gray-500">
            <span>Developed by Viren070.</span>
            <span>
              This beautiful UI would not be possible without{' '}
              <a
                href="https://seanime.rahim.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[--brand] hover:underline"
              >
                Seanime
              </a>
            </span>
          </div>
        </div>
      </div>
      <DonationModal
        open={donationModal.isOpen}
        onOpenChange={donationModal.toggle}
      />
      <CustomizeModal
        open={customizeModal.isOpen}
        onOpenChange={customizeModal.toggle}
        currentName={addonName}
        currentLogo={userData.addonLogo}
        currentDescription={userData.addonDescription}
      />
    </>
  );
}

function ChangelogBox({ version }: { version: string }) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [releases, setReleases] = React.useState<any[]>([]);
  const [visibleCount, setVisibleCount] = React.useState(0);
  const defaultChannel = version.startsWith('v') ? 'stable' : 'nightly';
  const [selectedChannel, setSelectedChannel] = React.useState<
    'stable' | 'nightly'
  >(defaultChannel);
  const [hasMorePages, setHasMorePages] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [fetchingMore, setFetchingMore] = React.useState(false);
  const [showLoadMoreOverlay, setShowLoadMoreOverlay] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Fetch releases with pagination
  const fetchReleases = React.useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/viren070/aiostreams/releases?per_page=100&page=${page}`
        );

        if (!response.ok) throw new Error('Failed to fetch releases');

        const newReleases = await response.json();

        // Check if there are more pages
        const linkHeader = response.headers.get('link');
        const hasNextPage = linkHeader && linkHeader.includes('rel="next"');
        setHasMorePages(!!hasNextPage);

        return newReleases;
      } catch (error) {
        throw error;
      }
    },
    []
  );

  // Filter releases by channel
  const filterReleasesByChannel = React.useCallback(
    (releases: any[], channel: 'stable' | 'nightly') => {
      if (channel === 'stable') {
        return releases.filter(
          (r: any) =>
            r.tag_name.startsWith('v') && !r.tag_name.includes('nightly')
        );
      } else {
        return releases.filter((r: any) => r.tag_name.endsWith('-nightly'));
      }
    },
    []
  );

  // Determine channel and minor prefix based on selected channel
  React.useEffect(() => {
    if (!version || version.toLowerCase() === 'unknown') {
      setError('No version available.');
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    setReleases([]);
    setVisibleCount(0);
    setCurrentPage(1);
    setHasMorePages(true);

    // Helper: get channel and minor prefix
    let channel: 'stable' | 'nightly';

    if (selectedChannel === 'stable') {
      channel = 'stable';
    } else {
      channel = 'nightly';
    }

    // Fetch initial releases
    fetchReleases(1, false)
      .then((allReleases) => {
        // Filter by channel
        const filtered = filterReleasesByChannel(allReleases, channel);

        // Sort by published date descending
        filtered.sort(
          (a, b) =>
            new Date(b.published_at).getTime() -
            new Date(a.published_at).getTime()
        );
        setReleases(filtered);
        setVisibleCount(Math.min(5, filtered.length));
      })
      .catch(() => setError('Failed to load changelogs.'))
      .finally(() => setLoading(false));
  }, [version, selectedChannel, fetchReleases, filterReleasesByChannel]);

  // Function to fetch more releases when needed
  const fetchMoreReleases = React.useCallback(async () => {
    if (!hasMorePages || fetchingMore) return;

    setFetchingMore(true);
    try {
      const nextPage = currentPage + 1;
      const newReleases = await fetchReleases(nextPage, false);

      // Filter the new releases by current channel
      const filtered = filterReleasesByChannel(newReleases, selectedChannel);

      if (filtered.length > 0) {
        // Sort by published date descending
        filtered.sort(
          (a, b) =>
            new Date(b.published_at).getTime() -
            new Date(a.published_at).getTime()
        );
        setReleases((prev) => [...prev, ...filtered]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Failed to fetch more releases:', error);
    } finally {
      setFetchingMore(false);
    }
  }, [
    hasMorePages,
    fetchingMore,
    currentPage,
    fetchReleases,
    selectedChannel,
    filterReleasesByChannel,
  ]);

  // Show/hide load more overlay based on scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;

      const hasMoreContent =
        releases.length > visibleCount || // More releases in memory
        (hasMorePages && !fetchingMore); // More pages to fetch

      setShowLoadMoreOverlay(isNearBottom && hasMoreContent && !loading);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Check on mount and when dependencies change
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [
    visibleCount,
    releases.length,
    hasMorePages,
    fetchingMore,
    loading,
    containerRef,
  ]);

  const handleLoadMore = () => {
    if (releases.length > visibleCount) {
      // Load more from current releases
      setVisibleCount((prev) => Math.min(prev + 5, releases.length));
      // Check if we need to fetch more after increasing visible count
      if (releases.length <= visibleCount + 5 && hasMorePages) {
        fetchMoreReleases();
      }
    } else if (hasMorePages && !fetchingMore) {
      // Fetch more releases from API
      fetchMoreReleases();
    }
  };

  const handleChannelChange = (channel: 'stable' | 'nightly') => {
    setSelectedChannel(channel);
  };

  const hasMoreContent =
    releases.length > visibleCount || (hasMorePages && !fetchingMore);

  return (
    <SettingsCard
      title="What's New"
      description={
        loading
          ? 'Loading changelogs...'
          : `View the latest changes for ${selectedChannel} releases`
      }
      className="h-full flex flex-col"
      action={
        <Select
          size="sm"
          options={[
            { value: 'stable', label: 'Stable' },
            { value: 'nightly', label: 'Nightly' },
          ]}
          value={selectedChannel}
          onValueChange={(value) =>
            handleChannelChange(value as 'stable' | 'nightly')
          }
          placeholder="Select channel"
          className="w-32"
        />
      }
    >
      <div className="relative flex-1" style={{ minHeight: '400px' }}>
        <div
          ref={containerRef}
          className="changelog-container absolute inset-0 pr-2"
          style={{
            overflowY: 'auto',
          }}
        >
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-4">
              <Alert intent="alert" title="Error" description={error} />
            </div>
          ) : releases.length === 0 ? (
            <div className="p-4">
              <Alert
                intent="info"
                title="No changelogs found"
                description={`No ${selectedChannel} changelogs available.`}
              />
            </div>
          ) : (
            <div className="relative min-h-full p-4 space-y-4">
              {releases.slice(0, visibleCount).map((release, idx) => (
                <Card
                  key={release.id || release.tag_name}
                  className="bg-gray-900/60 border border-gray-800 relative"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-semibold bg-[--brand]/20 text-[--brand] border border-[--brand]/30">
                          {release.tag_name}
                        </span>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700/60 text-gray-300 border border-gray-600/30">
                          {new Date(release.published_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="prose prose-invert prose-sm max-w-none [&_p]:text-sm [&_ul]:text-sm [&_li]:text-sm [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base">
                    <ReactMarkdown>
                      {release.body || 'No changelog provided.'}
                    </ReactMarkdown>
                  </CardContent>
                  <CardFooter>
                    <a
                      href={release.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[--brand] hover:underline flex items-center gap-2 text-xs"
                    >
                      <GithubIcon className="w-4 h-4" />
                      View on GitHub
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Load More Overlay */}
        {showLoadMoreOverlay && hasMoreContent && (
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none opacity-0 transition-opacity duration-300 ease-in-out"
            style={{
              height: '96px',
              opacity: showLoadMoreOverlay ? 1 : 0,
            }}
          >
            <div className="h-full flex items-end justify-center pb-4">
              <div
                className="flex flex-col items-center gap-2 pointer-events-auto opacity-0 translate-y-4 transition-all duration-300 ease-in-out"
                style={{
                  opacity: showLoadMoreOverlay ? 1 : 0,
                  transform: showLoadMoreOverlay
                    ? 'translateY(0)'
                    : 'translateY(1rem)',
                }}
              >
                <span className="text-sm font-medium text-white/90">
                  {fetchingMore
                    ? 'Loading...'
                    : releases.length > visibleCount
                      ? `Load ${Math.min(5, releases.length - visibleCount)} more`
                      : 'Load more releases'}
                </span>
                <button
                  onClick={handleLoadMore}
                  disabled={fetchingMore}
                  className="group flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {fetchingMore ? (
                    <div className="w-5 h-5 border-2 border-white/60 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      className="w-6 h-6 text-white/80 group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SettingsCard>
  );
}

function CustomizeModal({
  open,
  onOpenChange,
  currentName,
  currentLogo,
  currentDescription,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  currentLogo: string | undefined;
  currentDescription: string | undefined;
}) {
  const { userData, setUserData } = useUserData();
  const [name, setName] = useState(currentName);
  const [logo, setLogo] = useState(currentLogo);
  const [description, setDescription] = useState(currentDescription);
  // Update state when props change
  useEffect(() => {
    setName(currentName);
    setLogo(currentLogo);
    setDescription(currentDescription);
  }, [currentName, currentLogo, currentDescription]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setUserData((prev) => ({
      ...prev,
      addonName: name.trim(),
      addonLogo: logo?.trim(),
      addonDescription: description?.trim(),
    }));

    toast.success('Customization saved');
    onOpenChange(false);
  };

  const handleLogoChange = (value: string) => {
    setLogo(value.trim() || undefined);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Customize Addon">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <TextInput
              label="Addon Name"
              value={name}
              onValueChange={setName}
              placeholder="Enter addon name"
            />
            <p className="text-xs text-[--muted]">
              This name will be displayed in Stremio
            </p>
          </div>

          <div className="space-y-2">
            <TextInput
              label="Logo URL"
              value={logo}
              onValueChange={handleLogoChange}
              placeholder="Enter logo URL"
              type="url"
            />
            <p className="text-xs text-[--muted]">
              Enter a valid URL for your addon's logo image. Leave blank for
              default logo.
            </p>
          </div>

          <div className="space-y-2">
            <Textarea
              label="Addon Description"
              value={description}
              onValueChange={setDescription}
              placeholder="Enter addon description"
              rows={3}
            />
            <p className="text-xs text-[--muted]">
              This description will be displayed in Stremio
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              intent="primary-outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" intent="primary">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
