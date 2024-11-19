import DiscordSocialSignIn from '@/auth/components/buttons/social-sign-in/discord.social-sign-in';
import GithubSocialSignIn from '@/auth/components/buttons/social-sign-in/github.social-sign-in';

export default function SignInForm() {
  return (
    <div>
      <DiscordSocialSignIn />
      <GithubSocialSignIn />
    </div>
  );
}
