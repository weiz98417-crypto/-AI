// Vite asset imports for outfit & occasion images
// JPGs imported via Vite pipeline for reliable deploy
// SVGs remain in public/ directory (always load fine)
import workCommute1 from './outfits/work-commute-1-main.jpg'
import workCommute2 from './outfits/work-commute-2-main.jpg'
import workCommute3 from './outfits/work-commute-3-main.jpg'
import workCommute4 from './outfits/work-commute-4-main.jpg'
import workCommuteCard from './outfits/work-commute-card.jpg'

import clientMeeting1 from './outfits/client-meeting-1-main.jpg'
import clientMeeting2 from './outfits/client-meeting-2-main.jpg'
import clientMeeting3 from './outfits/client-meeting-3-main.jpg'
import clientMeetingCard from './outfits/client-meeting-card.jpg'

import weekendDate1 from './outfits/weekend-date-1-main.jpg'
import weekendDate2 from './outfits/weekend-date-2-main.jpg'
import weekendDate3 from './outfits/weekend-date-3-main.jpg'
import weekendDateCard from './outfits/weekend-date-card.jpg'

import girlsGathering1 from './outfits/girls-gathering-1-main.jpg'
import girlsGathering2 from './outfits/girls-gathering-2-main.jpg'
import girlsGathering3 from './outfits/girls-gathering-3-main.jpg'
import girlsGatheringCard from './outfits/girls-gathering-card.jpg'

export const outfitImages: Record<string, string> = {
  'work-commute-1-main': workCommute1,
  'work-commute-2-main': workCommute2,
  'work-commute-3-main': workCommute3,
  'work-commute-4-main': workCommute4,
  'work-commute-card': workCommuteCard,
  'client-meeting-1-main': clientMeeting1,
  'client-meeting-2-main': clientMeeting2,
  'client-meeting-3-main': clientMeeting3,
  'client-meeting-card': clientMeetingCard,
  'weekend-date-1-main': weekendDate1,
  'weekend-date-2-main': weekendDate2,
  'weekend-date-3-main': weekendDate3,
  'weekend-date-card': weekendDateCard,
  'girls-gathering-1-main': girlsGathering1,
  'girls-gathering-2-main': girlsGathering2,
  'girls-gathering-3-main': girlsGathering3,
  'girls-gathering-card': girlsGatheringCard,
}
