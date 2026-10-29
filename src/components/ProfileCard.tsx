import profileImage from "../assets/intro-pic.jpg";
import { profile } from "../data/content";

const ProfileCard = () => {
  return (
    <div className="tile flex gap-6 p-4 md:p-5">
      <img
        src={profileImage}
        alt={profile.name}
        draggable={false}
        className="hidden h-full w-[240px] shrink-0 rounded-2xl object-cover md:block lg:w-[300px]"
      />
      <div className="flex min-w-0 flex-col justify-center gap-4 p-2">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-fg lg:text-5xl">
            Hi, I'm <span className="text-accent">{profile.name}</span>
          </h1>
          <h2 className="mt-2 text-lg text-fg/90 lg:text-xl">
            CS + Math <span className="text-red-500">@ {profile.school}</span>
            <span className="text-muted"> · Class of {profile.graduation.split(" ")[1]}</span>
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted lg:text-base">{profile.bio}</p>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-fg ring-1 ring-accent/30">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {profile.lookingFor}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
