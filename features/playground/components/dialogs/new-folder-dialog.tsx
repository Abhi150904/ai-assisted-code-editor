"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface NewFolderDialogProps {
    isOpen: boolean
    onClose: () => void
    onCreateFolder: (folderName: string) => void
  }

  function NewFolderDialog({ isOpen, onClose, onCreateFolder }: NewFolderDialogProps) {
    const [folderName, setFolderName] = React.useState("")
    const handleClose = () => {
      setFolderName("")
      onClose()
    }
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (folderName.trim()) {
        onCreateFolder(folderName.trim())
        setFolderName("")
      }
    }
  
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>Enter a name for the new folder.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="foldername">
                  Folder Name
                </Label>
                <Input
                  id="foldername"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  autoFocus
                  placeholder="components"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!folderName.trim()}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  export default NewFolderDialog;
