export interface GenericScorecardSettings {
	title: string
	scoringDirection: 'lowest' | 'highest'
	roundLabel: string
}

const SETTINGS_KEY = 'familyGames.scorecard.generic.settings.v1'

export const DEFAULT_GENERIC_SETTINGS: GenericScorecardSettings = {
	title: 'Quick Scorecard',
	scoringDirection: 'highest',
	roundLabel: 'Round',
}

export function loadGenericScorecardSettings(): GenericScorecardSettings {
	try {
		const parsed = JSON.parse(
			localStorage.getItem(SETTINGS_KEY) ?? ''
		) as Partial<GenericScorecardSettings>
		return {
			title:
				typeof parsed.title === 'string' && parsed.title.trim()
					? parsed.title
					: DEFAULT_GENERIC_SETTINGS.title,
			scoringDirection: parsed.scoringDirection === 'lowest' ? 'lowest' : 'highest',
			roundLabel:
				typeof parsed.roundLabel === 'string' && parsed.roundLabel.trim()
					? parsed.roundLabel
					: DEFAULT_GENERIC_SETTINGS.roundLabel,
		}
	} catch {
		return DEFAULT_GENERIC_SETTINGS
	}
}

export function saveGenericScorecardSettings(settings: GenericScorecardSettings) {
	try {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
	} catch {
		// Ignore quota and private-mode errors.
	}
}
