"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronRight, Edit3, File, FilePlus, Folder, FolderPlus, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { TemplateFile, TemplateFolder } from "../lib/path-to-json"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import NewFileDialog from "./dialogs/new-file-dialog"
import NewFolderDialog from "./dialogs/new-folder-dialog"
import RenameFileDialog from "./dialogs/rename-file-dialog"
import RenameFolderDialog from "./dialogs/rename-folder-dialog"

interface FileTreeProps {
  data: TemplateFolder | null
  onFileSelect: (file: TemplateFile) => void
  selectedFile?: TemplateFile
  onTreeChange?: (nextTree: TemplateFolder) => void | Promise<void>
}

export function FileTree({ data, onFileSelect, selectedFile, onTreeChange }: FileTreeProps) {
  const [tree, setTree] = useState<TemplateFolder | null>(data)
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})
  const [newFileDialog, setNewFileDialog] = useState<{ isOpen: boolean; folderPath: number[] }>({
    isOpen: false,
    folderPath: [],
  })
  const [newFolderDialog, setNewFolderDialog] = useState<{ isOpen: boolean; folderPath: number[] }>({
    isOpen: false,
    folderPath: [],
  })
  const [renameFileDialog, setRenameFileDialog] = useState<{
    isOpen: boolean
    itemPath: number[]
    currentFilename: string
    currentExtension: string
  }>({
    isOpen: false,
    itemPath: [],
    currentFilename: "",
    currentExtension: "",
  })
  const [renameFolderDialog, setRenameFolderDialog] = useState<{
    isOpen: boolean
    itemPath: number[]
    currentFolderName: string
  }>({
    isOpen: false,
    itemPath: [],
    currentFolderName: "",
  })

  useEffect(() => {
    setTree(data)
  }, [data])

  const rootPath = useMemo(() => "root", [])

  const setExpanded = (path: string, next: boolean) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: next }))
  }

  const isExpanded = (path: string, level: number) => {
    if (expandedFolders[path] !== undefined) return expandedFolders[path]
    return level < 2
  }

  const getFolderByPath = (nextTree: TemplateFolder, folderPath: number[]) => {
    let current: TemplateFolder = nextTree
    for (const index of folderPath) {
      const next = current.items[index]
      if (!next || "filename" in next) return null
      current = next
    }
    return current
  }

  const openAddDialog = (folderPath: number[], kind: "file" | "folder") => {
    if (kind === "file") {
      setNewFileDialog({ isOpen: true, folderPath: [...folderPath] })
      return
    }
    setNewFolderDialog({ isOpen: true, folderPath: [...folderPath] })
  }

  const handleCreateFile = async (filename: string, extension: string) => {
    if (!tree) return

    const nextTree = structuredClone(tree)
    const current = getFolderByPath(nextTree, newFileDialog.folderPath)
    if (!current) return

    current.items.push({
      filename,
      fileExtension: extension,
      content: "",
    })

    setTree(nextTree)
    setNewFileDialog({ isOpen: false, folderPath: [] })
    await onTreeChange?.(nextTree)
  }

  const handleCreateFolder = async (folderName: string) => {
    if (!tree) return

    const nextTree = structuredClone(tree)
    const current = getFolderByPath(nextTree, newFolderDialog.folderPath)
    if (!current) return

    current.items.push({
      folderName,
      items: [],
    })

    setTree(nextTree)
    setNewFolderDialog({ isOpen: false, folderPath: [] })
    await onTreeChange?.(nextTree)
  }

  const renameItem = (itemPath: number[]) => {
    if (!tree || itemPath.length === 0) return

    let current: TemplateFolder = tree
    for (let i = 0; i < itemPath.length - 1; i += 1) {
      const next = current.items[itemPath[i]]
      if (!next || "filename" in next) return
      current = next
    }

    const targetIndex = itemPath[itemPath.length - 1]
    const target = current.items[targetIndex]
    if (!target) return

    if ("filename" in target) {
      setRenameFileDialog({
        isOpen: true,
        itemPath: [...itemPath],
        currentFilename: target.filename,
        currentExtension: target.fileExtension,
      })
      return
    }

    setRenameFolderDialog({
      isOpen: true,
      itemPath: [...itemPath],
      currentFolderName: target.folderName,
    })
  }

  const handleRenameFile = async (filename: string, extension: string) => {
    if (!tree || renameFileDialog.itemPath.length === 0) return

    const nextTree = structuredClone(tree)
    let current: TemplateFolder = nextTree

    for (let i = 0; i < renameFileDialog.itemPath.length - 1; i += 1) {
      const next = current.items[renameFileDialog.itemPath[i]]
      if (!next || "filename" in next) return
      current = next
    }

    const targetIndex = renameFileDialog.itemPath[renameFileDialog.itemPath.length - 1]
    const target = current.items[targetIndex]
    if (!target || !("filename" in target)) return

    current.items[targetIndex] = {
      ...target,
      filename: filename.trim(),
      fileExtension: extension.trim(),
    }

    setTree(nextTree)
    setRenameFileDialog({
      isOpen: false,
      itemPath: [],
      currentFilename: "",
      currentExtension: "",
    })
    await onTreeChange?.(nextTree)
  }

  const handleRenameFolder = async (folderName: string) => {
    if (!tree || renameFolderDialog.itemPath.length === 0) return

    const nextTree = structuredClone(tree)
    let current: TemplateFolder = nextTree

    for (let i = 0; i < renameFolderDialog.itemPath.length - 1; i += 1) {
      const next = current.items[renameFolderDialog.itemPath[i]]
      if (!next || "filename" in next) return
      current = next
    }

    const targetIndex = renameFolderDialog.itemPath[renameFolderDialog.itemPath.length - 1]
    const target = current.items[targetIndex]
    if (!target || "filename" in target) return

    current.items[targetIndex] = {
      ...target,
      folderName: folderName.trim(),
    }

    setTree(nextTree)
    setRenameFolderDialog({
      isOpen: false,
      itemPath: [],
      currentFolderName: "",
    })
    await onTreeChange?.(nextTree)
  }

  const deleteItem = async (itemPath: number[]) => {
    if (!tree || itemPath.length === 0) return

    const nextTree = structuredClone(tree)
    let current: TemplateFolder = nextTree

    for (let i = 0; i < itemPath.length - 1; i += 1) {
      const next = current.items[itemPath[i]]
      if (!next || "filename" in next) return
      current = next
    }

    const targetIndex = itemPath[itemPath.length - 1]
    if (targetIndex < 0 || targetIndex >= current.items.length) return

    current.items.splice(targetIndex, 1)
    setTree(nextTree)
    await onTreeChange?.(nextTree)
  }

  if (!tree) return null

  return (
    <div className="h-full w-full overflow-auto p-2">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">File Explorer</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => openAddDialog([], "file")}
            title="Add file"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => openAddDialog([], "folder")}
            title="Add folder"
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <FileTreeNode
        item={tree}
        itemPath={[]}
        pathKey={rootPath}
        level={0}
        onFileSelect={onFileSelect}
        selectedFile={selectedFile}
        openAddDialog={openAddDialog}
        renameItem={renameItem}
        deleteItem={deleteItem}
        isExpanded={isExpanded}
        setExpanded={setExpanded}
      />

      <NewFileDialog
        isOpen={newFileDialog.isOpen}
        onClose={() => setNewFileDialog({ isOpen: false, folderPath: [] })}
        onCreateFile={handleCreateFile}
      />
      <NewFolderDialog
        isOpen={newFolderDialog.isOpen}
        onClose={() => setNewFolderDialog({ isOpen: false, folderPath: [] })}
        onCreateFolder={handleCreateFolder}
      />
      <RenameFileDialog
        isOpen={renameFileDialog.isOpen}
        onClose={() =>
          setRenameFileDialog({
            isOpen: false,
            itemPath: [],
            currentFilename: "",
            currentExtension: "",
          })
        }
        onRename={handleRenameFile}
        currentFilename={renameFileDialog.currentFilename}
        currentExtension={renameFileDialog.currentExtension}
      />
      <RenameFolderDialog
        isOpen={renameFolderDialog.isOpen}
        onClose={() =>
          setRenameFolderDialog({
            isOpen: false,
            itemPath: [],
            currentFolderName: "",
          })
        }
        onRename={handleRenameFolder}
        currentFolderName={renameFolderDialog.currentFolderName}
      />
    </div>
  )
}

interface FileTreeNodeProps {
  item: TemplateFile | TemplateFolder
  itemPath: number[]
  pathKey: string
  onFileSelect: (file: TemplateFile) => void
  selectedFile?: TemplateFile
  openAddDialog: (folderPath: number[], kind: "file" | "folder") => void
  renameItem: (itemPath: number[]) => void
  deleteItem: (itemPath: number[]) => Promise<void>
  isExpanded: (path: string, level: number) => boolean
  setExpanded: (path: string, next: boolean) => void
  level: number
}

function isFileItem(item: TemplateFile | TemplateFolder): item is TemplateFile {
  return "filename" in item
}

function FileTreeNode({
  item,
  itemPath,
  pathKey,
  onFileSelect,
  selectedFile,
  openAddDialog,
  renameItem,
  deleteItem,
  isExpanded,
  setExpanded,
  level,
}: FileTreeNodeProps) {
  if (isFileItem(item)) {
    const isSelected =
      selectedFile && selectedFile.filename === item.filename && selectedFile.fileExtension === item.fileExtension

    const fileName = item.fileExtension ? `${item.filename}.${item.fileExtension}` : item.filename

    return (
      <div
        className={cn(
          "group flex items-center py-1 px-2 text-sm cursor-pointer hover:bg-accent/50 rounded-md",
          isSelected && "bg-accent text-accent-foreground",
        )}
        style={{ paddingLeft: `${8 + level * 12}px` }}
        onClick={() => onFileSelect(item)}
      >
        <File className="h-4 w-4 mr-2 shrink-0" />
        <span className="truncate">{fileName}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
              title="File options"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => renameItem(itemPath)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => deleteItem(itemPath)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  const expanded = isExpanded(pathKey, level)

  return (
    <div>
      <Collapsible open={expanded} onOpenChange={(next) => setExpanded(pathKey, next)} className="w-full">
        <div className="group flex items-center">
          <CollapsibleTrigger
            className="flex min-w-0 flex-1 items-center py-1 px-2 text-sm hover:bg-accent/50 rounded-md"
            style={{ paddingLeft: `${8 + level * 12}px` }}
          >
            <ChevronRight className={cn("h-4 w-4 mr-1 shrink-0 transition-transform", expanded && "rotate-90")} />
            <Folder className="h-4 w-4 mr-2 shrink-0" />
            <span className="truncate">{item.folderName}</span>
          </CollapsibleTrigger>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mr-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
                title="Folder options"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => openAddDialog(itemPath, "file")}>
                <FilePlus className="mr-2 h-4 w-4" />
                New File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openAddDialog(itemPath, "folder")}>
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => renameItem(itemPath)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => deleteItem(itemPath)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CollapsibleContent className="pl-4 border-l border-border/50 ml-3 mt-1">
          {item.items.map((childItem, index) => (
            <FileTreeNode
              key={`${pathKey}-${index}`}
              item={childItem}
              itemPath={[...itemPath, index]}
              pathKey={`${pathKey}-${index}`}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
              openAddDialog={openAddDialog}
              renameItem={renameItem}
              deleteItem={deleteItem}
              isExpanded={isExpanded}
              setExpanded={setExpanded}
              level={level + 1}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
