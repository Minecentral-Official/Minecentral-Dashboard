import DiscordSocialSignIn from '@/auth/components/buttons/social-sign-in/discord.social-sign-in';
import { Card } from '@/components/ui/card';

export default function SignInPage() {
  return (
    <Card>
      <DiscordSocialSignIn />
    </Card>
  );
}
