// Exercises this app adds on top of the upstream dataset.
//
// exercises-data.js is generated from the upstream catalogue and gets replaced wholesale when
// that is refreshed, so anything added there would quietly disappear on the next update. These
// live separately and are concatenated onto it in exercises.js, in exactly the same shape, so
// search, the body map, planning, history and Duplicate & edit all treat them identically.
//
// They carry no `img`/`gif` — there is no animation to point at, and Media/Thumb already fall
// back to a placeholder for a medialess exercise. The `x` ids cannot collide with the upstream
// numeric ones, and mark at a glance which entries are ours.
//
// Muscle names use the dataset's own spellings (`glutes`, `spine`, `delts`) rather than the
// body map's slugs, so these read the same as every neighbouring entry; canonMuscle resolves
// both. Every value here is one the map can actually draw — see the test.
export const EXTRA = [
  {
    id: 'x0001', n: 'bird dog', bp: 'waist', eq: 'body weight',
    tg: 'abs', sm: ['glutes', 'spine', 'delts'],
    st: [
      'Start on all fours with your hands under your shoulders and your knees under your hips.',
      'Brace your core so your lower back stays flat — imagine balancing a glass of water on it.',
      'Extend one arm forward and the opposite leg straight back, both level with your torso.',
      'Hold for a moment without letting your hips rotate or your back arch.',
      'Return to all fours under control and repeat on the other side.'
    ]
  },
  {
    id: 'x0002', n: 'bodyweight squat', bp: 'upper legs', eq: 'body weight',
    tg: 'quads', sm: ['glutes', 'hamstrings', 'calves'],
    st: [
      'Stand with your feet a little wider than your hips, toes turned slightly out.',
      'Hold your arms in front of you for balance and brace your core.',
      'Push your hips back and bend your knees, keeping your chest up and your heels down.',
      'Descend until your thighs are at least parallel to the floor, or as far as your hips allow.',
      'Drive through your whole foot to stand back up, squeezing your glutes at the top.'
    ]
  },
  {
    id: 'x0003', n: 'bodyweight good morning', bp: 'upper legs', eq: 'body weight',
    tg: 'hamstrings', sm: ['glutes', 'spine'],
    st: [
      'Stand with your feet hip-width apart, hands behind your head or crossed on your chest.',
      'Soften your knees slightly and keep them there for the whole repetition.',
      'Push your hips backwards and hinge your torso forward, keeping your back flat.',
      'Lower until you feel a stretch in your hamstrings, without letting your lower back round.',
      'Drive your hips forward to return to standing, squeezing your glutes at the top.'
    ]
  },
  {
    id: 'x0004', n: 'single leg hip thrust', bp: 'upper legs', eq: 'body weight',
    tg: 'glutes', sm: ['hamstrings', 'abs'],
    st: [
      'Sit on the floor with your upper back against a bench and both feet flat in front of you.',
      'Lift one foot off the floor and hold that knee towards your chest.',
      'Drive through the heel of the planted foot until your body is straight from shoulder to knee.',
      'Squeeze the glute hard at the top without arching your lower back.',
      'Lower under control until your hips are just off the floor, then repeat. Swap sides.'
    ]
  },
  {
    id: 'x0005', n: 'side plank', bp: 'waist', eq: 'body weight',
    tg: 'obliques', sm: ['abs', 'glutes', 'delts'],
    st: [
      'Lie on your side with your forearm on the floor and your elbow directly under your shoulder.',
      'Stack your feet, or stagger them for a wider base.',
      'Lift your hips so your body forms a straight line from head to heels.',
      'Keep your top shoulder stacked over the bottom one — do not let your chest rotate down.',
      'Hold for the prescribed time, then lower and swap sides.'
    ]
  },
]

// Catalogue exercises that are stretches. The upstream dataset has no stretch category — it
// files all of these as ordinary exercises, so a hamstring stretch counts as hamstring volume
// and shades the body map exactly like a set of curls. Flagged here so they stop doing that
// (see musclesOf) and so they default to a timed hold rather than reps (see modeOf).
//
// Derived from the 57 entries whose name contains "stretch", minus two that only look like it:
//   3645 "single leg bridge with outstretched leg" — a glute bridge; "outstretched" matched
//   3642 "weighted stretch lunge"                  — a loaded lunge, not a stretch
// plus 1494 "butterfly yoga pose", a seated adductor stretch that never says the word.
export const STRETCH_IDS = new Set([
  '0257', '0613', '0643', '0669', '0690', '0716', '0721', '0794',
  '0817', '1167', '1259', '1271', '1272', '1339', '1341', '1342',
  '1346', '1358', '1363', '1365', '1377', '1378', '1388', '1389',
  '1390', '1398', '1403', '1405', '1407', '1419', '1424', '1494',
  '1511', '1512', '1548', '1559', '1560', '1564', '1576', '1585',
  '1599', '1604', '1708', '1709', '1710', '1712', '1713', '1714',
  '1716', '1745', '2202', '2205', '2207', '2208', '2567', '2571',
])
