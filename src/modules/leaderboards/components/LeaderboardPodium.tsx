import { Crown, Trophy, Medal, Clock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { type LeaderboardRow } from '../utils/leaderboardValidation'

function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return '0s'
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hrs > 0) return `${hrs}h ${mins}m`
  if (mins > 0) return `${mins}m ${secs}s`
  return `${secs}s`
}

interface LeaderboardPodiumProps {
  topThree: LeaderboardRow[]
  isContest?: boolean
}

export default function LeaderboardPodium({ topThree, isContest = true }: LeaderboardPodiumProps) {
  if (!topThree || topThree.length === 0) return null

  const first = topThree.find((u) => u.rank === 1) || topThree[0]
  const second = topThree.find((u) => u.rank === 2) || topThree[1]
  const third = topThree.find((u) => u.rank === 3) || topThree[2]

  return (
    <div className="w-full max-w-2xl mx-auto pt-6 pb-2 px-3 select-none">
      <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end">

        {/* ================= 2ND PLACE (RUNNER-UP) ================= */}
        <div className="flex flex-col items-center min-w-0 w-full">
          {second && (
            <div className="flex flex-col items-center w-full">
              {/* User Info Above Step */}
              <div className="flex flex-col items-center text-center w-full min-w-0 mb-3 space-y-1">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-slate-300 ring-4 ring-slate-100 shadow-sm bg-white shrink-0 overflow-hidden">
                  <AvatarImage className="rounded-full object-cover" src={second.profile_pic || undefined} alt={second.firstname} />
                  <AvatarFallback className="h-full w-full rounded-full bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center">
                    {second.firstname?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="w-full min-w-0 space-y-0.5">
                  <p className="w-full text-xs sm:text-sm font-bold text-slate-900 truncate px-1" title={`${second.firstname} ${second.lastname}`}>
                    {second.firstname} {second.lastname}
                  </p>

                  <p className="text-xs sm:text-sm font-extrabold text-slate-700 font-mono">
                    {second.score} <span className="text-[10px] text-slate-400 font-sans font-normal">pts</span>
                  </p>

                  {second.duration_seconds > 0 && (
                    <p className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-0.5">
                      <Clock className="h-2.5 w-2.5 shrink-0" />
                      <span>{formatDuration(second.duration_seconds)}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Step 2 Pedestal Block */}
              <div className="w-full h-32 sm:h-40 rounded-t-2xl bg-gradient-to-b from-slate-100 via-slate-100/90 to-slate-200/50 border-t-2 border-x-2 border-slate-300/80 flex flex-col items-center justify-center shadow-xs">
                <Medal className="h-5 w-5 text-slate-500 mb-0.5 opacity-90" />
                <span className="text-3xl sm:text-4xl font-black text-slate-400 font-mono leading-none">2</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                  {isContest ? 'Runner-Up' : '2nd Place'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ================= 1ST PLACE (WINNER) ================= */}
        <div className="flex flex-col items-center min-w-0 w-full">
          {first && (
            <div className="flex flex-col items-center w-full">
              {/* Crown + Winner Info Above Step */}
              <div className="flex flex-col items-center text-center w-full min-w-0 mb-3 space-y-1">
                <Crown className="h-7 w-7 sm:h-8 sm:w-8 text-amber-500 fill-amber-400 drop-shadow-xs shrink-0" />

                {/* Completely Circular Avatar & Fallback (A) */}
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-amber-400 ring-4 ring-amber-100/90 shadow-md bg-white shrink-0 overflow-hidden">
                  <AvatarImage className="rounded-full object-cover" src={first.profile_pic || undefined} alt={first.firstname} />
                  <AvatarFallback className="h-full w-full rounded-full bg-amber-100 text-amber-950 font-black text-base sm:text-lg flex items-center justify-center">
                    {first.firstname?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="w-full min-w-0 space-y-0.5">
                  <p className="w-full text-xs sm:text-base font-extrabold text-slate-900 truncate px-1" title={`${first.firstname} ${first.lastname}`}>
                    {first.firstname} {first.lastname}
                  </p>

                  <p className="text-sm sm:text-base font-black text-amber-600 font-mono">
                    {first.score} <span className="text-xs text-amber-900/60 font-sans font-bold">pts</span>
                  </p>

                  {first.duration_seconds > 0 && (
                    <p className="text-[10.5px] text-amber-800/80 font-mono font-medium flex items-center justify-center gap-0.5">
                      <Clock className="h-2.5 w-2.5 text-amber-600 shrink-0" />
                      <span>{formatDuration(first.duration_seconds)}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Step 1 Pedestal Block (Tallest) */}
              <div className="w-full h-44 sm:h-56 rounded-t-2xl bg-gradient-to-b from-amber-100/90 via-amber-50 to-amber-100/40 border-t-2 border-x-2 border-amber-300 shadow-md flex flex-col items-center justify-center">
                <Crown className="h-6 w-6 text-amber-600 mb-0.5" />
                <span className="text-4xl sm:text-5xl font-black text-amber-600 font-mono leading-none">1</span>
                <span className="text-[10px] sm:text-xs font-black text-amber-800 uppercase tracking-wider mt-1">
                  {isContest ? 'Winner' : '1st Place'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ================= 3RD PLACE (3RD PLACE) ================= */}
        <div className="flex flex-col items-center min-w-0 w-full">
          {third && (
            <div className="flex flex-col items-center w-full">
              {/* User Info Above Step */}
              <div className="flex flex-col items-center text-center w-full min-w-0 mb-3 space-y-1">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-amber-300 ring-4 ring-amber-50 shadow-sm bg-white shrink-0 overflow-hidden">
                  <AvatarImage className="rounded-full object-cover" src={third.profile_pic || undefined} alt={third.firstname} />
                  <AvatarFallback className="h-full w-full rounded-full bg-amber-50 text-amber-900 font-bold text-sm flex items-center justify-center">
                    {third.firstname?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="w-full min-w-0 space-y-0.5">
                  <p className="w-full text-xs sm:text-sm font-bold text-slate-900 truncate px-1" title={`${third.firstname} ${third.lastname}`}>
                    {third.firstname} {third.lastname}
                  </p>

                  <p className="text-xs sm:text-sm font-extrabold text-slate-700 font-mono">
                    {third.score} <span className="text-[10px] text-slate-400 font-sans font-normal">pts</span>
                  </p>

                  {third.duration_seconds > 0 && (
                    <p className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-0.5">
                      <Clock className="h-2.5 w-2.5 shrink-0" />
                      <span>{formatDuration(third.duration_seconds)}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Step 3 Pedestal Block (Shortest) */}
              <div className="w-full h-24 sm:h-32 rounded-t-2xl bg-gradient-to-b from-amber-50 via-orange-50/60 to-orange-100/30 border-t-2 border-x-2 border-amber-200/80 flex flex-col items-center justify-center shadow-2xs">
                <Trophy className="h-5 w-5 text-amber-700 mb-0.5 opacity-80" />
                <span className="text-3xl sm:text-4xl font-black text-amber-800/40 font-mono leading-none">3</span>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mt-1">
                  {isContest ? '2nd Runner-Up' : '3rd Place'}
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}