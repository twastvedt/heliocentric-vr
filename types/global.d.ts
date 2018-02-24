interface NodeListOf<TNode extends Node> {
	forEach: (f: (item: TNode) => void) => void;
}

declare namespace AFrame {
	export interface AFrameGlobal {
		anime: ((params: anime.AnimeParams) => anime.AnimeInstance);
	}
}