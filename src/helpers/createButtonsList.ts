import { KeyboardButton } from "node-telegram-bot-api";

type Params = {
	input: SurahInfo[];
	columnsPerRow: number;
};

export default function createButtonsList({
	input,
	columnsPerRow = 3,
}: Params): KeyboardButton[][] {
	const buttons: any[][] = [];

	input.forEach((item, index) => {
		const isNestedArray = Math.floor(index % columnsPerRow) === 0;
		if (isNestedArray) buttons.push([]);

		const outputButton: KeyboardButton = {
			text: item.name_arabic,
		};

		buttons[Math.floor(index / columnsPerRow)].push(outputButton);
	});

	return buttons;
}

type VersesParams = {
	input: number[];
	columnsPerRow: number;
};
export function createVersesButtonsList({
	input,
	columnsPerRow = 3,
}: VersesParams): KeyboardButton[][] {
	// @eslint-disable-next-line @typescript-eslint/no-explicit-any
	const buttons: any[][] = [];

	input.forEach((item, index) => {
		const isNestedArray = Math.floor(index % columnsPerRow) === 0;
		if (isNestedArray) buttons.push([]);

		const outputButton: KeyboardButton = {
			text: item.toString(),
		};

		buttons[Math.floor(index / columnsPerRow)].push(outputButton);
	});

	return buttons;
}
