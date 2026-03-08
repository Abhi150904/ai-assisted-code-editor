"use client"

import React from "react"
import { PanelLeftClose, PanelLeftOpen, Save } from "lucide-react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarInset } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileTree } from "@/features/playground/components/file-tree"
import { usePlayground } from "@/features/playground/hooks/usePlayground"
import { useFileExplorer } from "@/features/playground/hooks/useFileExplorer"
import { Bot } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Settings } from "lucide-react"
import { FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import { PlaygroundEditor } from "@/features/playground/components/playground-editor"

const page = () => {
  const { id } = useParams<{ id: string }>()
  const { playgroundData, templateData, saveTemplateData } = usePlayground(id)
  const [isExplorerOpen, setIsExplorerOpen] = React.useState(true)
  const [isPreviewVisible, setIsPreviewVisible] = React.useState(true)
  

  const {
    activeFileId,
    closeAllFiles,
    openFile,
    closeFile,
    editorContent,
    updateFileContent,
    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles,
  } = useFileExplorer();

  const activeFile = openFiles.find((file) => file.id === activeFileId)
  const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges)

  React.useEffect(() => {
    setPlaygroundId(id)
  }, [id, setPlaygroundId])

  React.useEffect(() => {
    setTemplateData(templateData ?? null)
  }, [templateData, setTemplateData])

  const handleSave = () => {
    // TODO: wire save action to editor state/webcontainer sync
    console.log("Save clicked")
  }
  const handleSaveAll = async () => {
    const unsavedFiles = openFiles.filter((f) => f.hasUnsavedChanges);

    if (unsavedFiles.length === 0) {
      toast.info("No unsaved changes");
      return;
    }

    try {
      await Promise.all(unsavedFiles.map((f) => handleSave())); //f.id
      toast.success(`Saved ${unsavedFiles.length} file(s)`);
    } catch (error) {
      toast.error("Failed to save some files");
    }
  };


  return (
    <div className="flex h-screen w-full overflow-hidden">
    <TooltipProvider>
      <aside
        className={`border-r transition-all duration-200 ${
          isExplorerOpen ? "w-72" : "w-0 border-r-0"
        }`}
      >
        {isExplorerOpen && (
          <FileTree
            data={templateData}
            onFileSelect={openFile}
            selectedFile={activeFile}
            onTreeChange={saveTemplateData}
          />
        )}
      </aside>

      <SidebarInset className="min-w-0 flex-1">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsExplorerOpen((prev) => !prev)}
            title={isExplorerOpen ? "Close explorer" : "Open explorer"}
          >
            {isExplorerOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
          <Separator orientation="vertical" className="mr-1 h-4" />
          <div className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 flex-col">
              <h1 className="text-sm font-medium">
                {playgroundData?.title || "Code Playground"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {openFiles.length} file(s) open
                {hasUnsavedChanges && " • Unsaved changes"}
                {activeFile ? ` • ${activeFile.filename}.${activeFile.fileExtension}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave()}
                      disabled={!activeFile || !activeFile.hasUnsavedChanges}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save (Ctrl+S)</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSaveAll}
                      disabled={!hasUnsavedChanges}
                    >
                      <Save className="h-4 w-4" />All
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save All (Ctrl+Shift+S)</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/*TODO: Toggle AI */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={()=>{}}
                      disabled={!hasUnsavedChanges}
                    >
                      <Bot className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>AI Assistant</TooltipContent>
                </Tooltip>
              </TooltipProvider>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                    >
                      {isPreviewVisible ? "Hide" : "Show"} Preview
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={closeAllFiles}>
                      Close All Files
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
        </header>
        <div className="h-[calc(100vh-4rem)]">
            {
                openFiles.length > 0 ? (
                <div className="h-full flex flex-col">
                    <div className="border-b bg-mmuted/30">
                        <Tabs
                        value={activeFileId || ""}
                        onValueChange={setActiveFileId}
                        >
                            <div className="flex items-center justify-between px-4 py-2">
                      <TabsList className="h-8 bg-transparent p-0">
                        {openFiles.map((file) => (
                          <TabsTrigger
                            key={file.id}
                            value={file.id}
                            className="relative h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm group"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-3 w-3" />
                              <span>
                                {file.filename}.{file.fileExtension}
                              </span>
                              {file.hasUnsavedChanges && (
                                <span className="h-2 w-2 rounded-full bg-orange-500" />
                              )}
                              <span
                                className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeFile(file.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </span>
                            </div>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {openFiles.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={closeAllFiles}
                          className="h-6 px-2 text-xs"
                        >
                          Close All
                        </Button>
                      )}
                    </div>  
                    </Tabs>
                    </div>
                    <div className="flex-1">
                        {/* TODO: implement editor */}
                        <ResizablePanelGroup
                    orientation="horizontal"
                    className="h-full"
                  >
                    <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
                      <PlaygroundEditor
                        activeFile={activeFile}
                        content={activeFile?.content || ""}
                        onContentChange={(value) =>
                          activeFileId && updateFileContent(activeFileId, value)
                        }
                        suggestion={null}
                        suggestionLoading={false}
                        suggestionPosition={null}
                        onAcceptSuggestion={() => {}}
                        onRejectSuggestion={() => {}}
                        onTriggerSuggestion={() => {}}
                      />
                    </ResizablePanel>

                    
                  </ResizablePanelGroup>
                        
                    </div>
                </div>
                ) : (
                    <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
                        <FileText className="h-12 w-12" />
                        <div className="text-center">
                            <p className="text-lg font-medium">No file is open</p>
                            <p className="text-sm text-gray-500">Open a file from the explorer to view its content</p>
                        </div>
                        
                    </div>
                )
            }

        </div>
      </SidebarInset>
      </TooltipProvider>
    </div>
  )
}

export default page
