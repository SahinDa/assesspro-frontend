import { Crown, Medal, Trophy, Clock, Flame, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { type LeaderboardRow, formatDuration } from '../utils/leaderboardValidation'

interface LeaderboardPodiumProps {
  topThree: LeaderboardRow[]
  isContest?: boolean
}

export default function LeaderboardPodium({ topThree, isContest = true }: LeaderboardPodiumProps) {
  if (!topThree || topThree.length === 0) return null

  const winner = topThree.find((u) => u.rank === 1) || topThree[0]
  const runnerUp = topThree.find((u) => u.rank === 2) || topThree[1]
  const secondRunnerUp = topThree.find((u) => u.rank === 3) || topThree[2]

  return (
    <div className="w-full max-w-4xl mx-auto pt-6 pb-2 px-2 select-none">
      <div className="grid grid-cols-3 gap-2.5 sm:gap-5 items-end">

        {/* ================= 2ND PLACE (SILVER / LEFT) ================= */}
        <div className="flex flex-col items-center w-full min-w-0">
          {runnerUp && (
            <div className="w-full flex flex-col items-center">
              {/* Profile Avatar */}
              <div className="relative mb-3 flex flex-col items-center">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-slate-300 ring-4 ring-slate-100 shadow-md bg-white shrink-0">
                  <AvatarImage src={runnerUp.profile_pic || undefined} alt={runnerUp.firstname} />
                  <AvatarFallback className="bg-slate-100 text-slate-800 text-sm font-black">
                    {runnerUp.firstname?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-slate-700 border-2 border-white flex items-center justify-center text-xs font-black text-white shadow-md">
                  2
                </span>
              </div>

              {/* Pedestal Step Card (Medium Height: h-48 sm:h-54) */}
              <Card className="w-full h-48 sm:h-54 bg-white border border-slate-200/90 rounded-t-2xl rounded-b-lg shadow-sm flex flex-col items-center justify-between p-3.5 text-center relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-slate-300" />

                <div className="w-full min-w-0">
                  <Badge
                    variant="outline"
                    className="bg-slate-100 text-slate-800 border-slate-300 text-[11px] font-extrabold px-2.5 py-0.5 gap-1 shadow-2xs mb-1"
                  >
                    <Medal className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                    <span>{isContest ? 'Runner-Up' : '2nd Place'}</span>
                  </Badge>

                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 truncate mt-1.5" title={`${runnerUp.firstname} ${runnerUp.lastname}`}>
                    {runnerUp.firstname} {runnerUp.lastname}
                  </p>

                  <p className="text-sm sm:text-base font-black text-slate-900 mt-1">
                    {runnerUp.score} <span className="text-xs font-semibold text-slate-500">pts</span>
                  </p>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 mt-2 font-mono">
                    <Clock className="h-3 w-3 text-slate-500 shrink-0" />
                    <span>{formatDuration(runnerUp.duration_seconds)}</span>
                  </div>
                </div>

                <div className="text-3xl sm:text-4xl font-black text-slate-200 font-mono">
                  2
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* ================= 1ST PLACE (GOLD / CENTER - ELEVATED) ================= */}
        <div className="flex flex-col items-center w-full min-w-0 -translate-y-2 sm:-translate-y-4">
          {winner && (
            <div className="w-full flex flex-col items-center">
              {/* Crown + Winner Avatar */}
              <div className="relative mb-3 flex flex-col items-center">
                <Crown className="h-7 w-7 text-amber-500 fill-amber-400 mb-1 drop-shadow-md animate-bounce" />
                <div className="relative">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-amber-400 ring-4 ring-amber-100 shadow-xl bg-white shrink-0">
                    <AvatarImage src={winner.profile_pic || undefined} alt={winner.firstname} />
                    <AvatarFallback className="bg-amber-100 text-amber-950 text-base font-black">
                      {winner.firstname?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 border-2 border-white flex items-center justify-center text-xs font-black text-amber-950 shadow-md">
                    1
                  </span>
                </div>
              </div>

              {/* Pedestal Step Card (Tallest: h-56 sm:h-64) */}
              <Card className="w-full h-56 sm:h-64 bg-gradient-to-b from-amber-50/70 via-white to-white border-2 border-amber-300 rounded-t-2xl rounded-b-lg shadow-md flex flex-col items-center justify-between p-4 text-center relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400" />

                <div className="w-full min-w-0">
                  <Badge
                    className="bg-amber-400 hover:bg-amber-400 text-amber-950 border-0 text-xs font-black px-3 py-0.5 gap-1 shadow-xs mb-1"
                  >
                    {isContest ? <Flame className="h-3.5 w-3.5 fill-current shrink-0" /> : <Sparkles className="h-3.5 w-3.5 fill-current shrink-0" />}
                    <span>{isContest ? '1st Winner' : 'Champion'}</span>
                  </Badge>

                  <p className="text-sm sm:text-base font-black text-slate-900 truncate mt-2" title={`${winner.firstname} ${winner.lastname}`}>
                    {winner.firstname} {winner.lastname}
                  </p>

                  <p className="text-base sm:text-lg font-black text-amber-700 mt-1">
                    {winner.score} <span className="text-xs font-bold text-amber-900/70">pts</span>
                  </p>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-xs font-bold text-amber-950 mt-2 font-mono">
                    <Clock className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                    <span>{formatDuration(winner.duration_seconds)}</span>
                  </div>
                </div>

                <div className="text-4xl sm:text-5xl font-black text-amber-200/90 font-mono">
                  1
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* ================= 3RD PLACE (BRONZE / RIGHT) ================= */}
        <div className="flex flex-col items-center w-full min-w-0">
          {secondRunnerUp && (
            <div className="w-full flex flex-col items-center">
              {/* Profile Avatar */}
              <div className="relative mb-3 flex flex-col items-center">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-amber-300 ring-4 ring-amber-50 shadow-md bg-white shrink-0">
                  <AvatarImage src={secondRunnerUp.profile_pic || undefined} alt={secondRunnerUp.firstname} />
                  <AvatarFallback className="bg-amber-50 text-amber-900 text-sm font-black">
                    {secondRunnerUp.firstname?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-amber-800 border-2 border-white flex items-center justify-center text-xs font-black text-white shadow-md">
                  3
                </span>
              </div>

              {/* Pedestal Step Card (Shortest: h-42 sm:h-48) */}
              <Card className="w-full h-42 sm:h-48 bg-white border border-slate-200/90 rounded-t-2xl rounded-b-lg shadow-sm flex flex-col items-center justify-between p-3.5 text-center relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-amber-400/80" />

                <div className="w-full min-w-0">
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-900 border-amber-200 text-[11px] font-extrabold px-2.5 py-0.5 gap-1 shadow-2xs mb-1"
                  >
                    <Trophy className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                    <span>{isContest ? '2nd Runner-Up' : '3rd Place'}</span>
                  </Badge>

                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 truncate mt-1.5" title={`${secondRunnerUp.firstname} ${secondRunnerUp.lastname}`}>
                    {secondRunnerUp.firstname} {secondRunnerUp.lastname}
                  </p>

                  <p className="text-sm sm:text-base font-black text-slate-900 mt-1">
                    {secondRunnerUp.score} <span className="text-xs font-semibold text-slate-500">pts</span>
                  </p>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-xs font-semibold text-amber-950 mt-2 font-mono">
                    <Clock className="h-3 w-3 text-amber-700 shrink-0" />
                    <span>{formatDuration(secondRunnerUp.duration_seconds)}</span>
                  </div>
                </div>

                <div className="text-3xl sm:text-4xl font-black text-slate-200 font-mono">
                  3
                </div>
              </Card>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}