import { CtaSection } from '@/components/sections/primitives/cta.section';

export default function HostCtaSection() {
  return (
    <CtaSection
      badgeChildren='Get started'
      title='Try our services today!'
      subtitle='Managing a Minecraft server is a hassle already! Let us help you get started with a low barrier to entry hosting solution! Our goal is to lower entry cost while allowing for infinite future expansion when you are ready!'
      primaryButtonChildren='Sign up now'
      primaryButtonHref='/sign-in'
      secondaryButtonChildren='View pricing'
      secondaryButtonHref='/host/pricing'
    />
  );
}
