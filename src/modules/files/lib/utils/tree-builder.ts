import type { FolderItem } from '../types/file';
import type { FolderTreeNode } from '../types/folder';

/**
 * Builds a recursive hierarchical FolderTreeNode tree from a flat list of FolderItems.
 */
export function buildFolderTree(
  flatFolders: FolderItem[],
  rootParentId: string | null = null,
  depth = 0
): FolderTreeNode[] {
  const nodeMap = new Map<string, FolderTreeNode>();
  const rootNodes: FolderTreeNode[] = [];

  // Initialize node instances
  for (const folder of flatFolders) {
    nodeMap.set(folder.id, {
      id: folder.id,
      projectId: folder.projectId,
      parentId: folder.parentId,
      name: folder.name,
      depth: 0,
      itemCount: folder.itemCount || 0,
      children: [],
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    });
  }

  // Populate children arrays and root nodes
  for (const folder of flatFolders) {
    const node = nodeMap.get(folder.id);
    if (!node) continue;

    if (folder.parentId && nodeMap.has(folder.parentId)) {
      const parentNode = nodeMap.get(folder.parentId)!;
      node.depth = parentNode.depth + 1;
      parentNode.children?.push(node);
    } else {
      node.depth = depth;
      rootNodes.push(node);
    }
  }

  // Sort root nodes and children alphabetically by name
  const sortNodes = (nodes: FolderTreeNode[]) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name));
    for (const n of nodes) {
      if (n.children && n.children.length > 0) {
        sortNodes(n.children);
      }
    }
  };

  sortNodes(rootNodes);
  return rootNodes;
}

/**
 * Flattens a recursive tree into a linear list with depth indicators for virtualized rendering.
 */
export function flattenVisibleTree(
  nodes: FolderTreeNode[],
  expandedIds: Set<string>
): FolderTreeNode[] {
  const result: FolderTreeNode[] = [];

  const traverse = (nodeList: FolderTreeNode[]) => {
    for (const node of nodeList) {
      result.push(node);
      if (expandedIds.has(node.id) && node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  };

  traverse(nodes);
  return result;
}
