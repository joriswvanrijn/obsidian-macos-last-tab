import { Plugin, WorkspaceLeaf } from 'obsidian';

export default class MacOSLastTab extends Plugin {
	async onload() {
		this.addCommand({
			id: 'close-tab-or-close-window',
			name: 'Close current tab or close window (if last tab)',
			callback: () => {
				const workspace = this.app.workspace;

				// @ts-expect-error workspace.activeTabGroup is not a public field
				const activeTabGroup = workspace.activeTabGroup;
				const currentTab = activeTabGroup.currentTab;
				const activeLeaf = activeTabGroup.children[currentTab];
				if (!activeLeaf) return;

				// If this is the last tab, close the window
				if (activeTabGroup.children.length == 1) {
					console.log('close window');
					// @ts-expect-error app.commands is not a public field
					this.app.commands.executeCommandById('workspace:close-window');
				}

				// If not, just close the tab
				const leaf = this.app.workspace.getLeafById(activeLeaf.id);
				if (!leaf) return;

				this.detachLeafIfUnpinned(leaf);
			}
		});
	}

	detachLeafIfUnpinned(leaf: WorkspaceLeaf) {
		// @ts-expect-error leaf.pinned is not a public field
		if (leaf.pinned) return;
		// workaround for `leaf.detach()` failure
		sleep(0).then(() => {
			leaf.detach();
		});
	}
}

