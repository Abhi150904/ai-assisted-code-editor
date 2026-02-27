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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface NewFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFile: (filename: string, extension: string) => void;
}

function NewFileDialog({ isOpen, onClose, onCreateFile }: NewFileDialogProps) {
  const [filename, setFilename] = React.useState("");
  const [extension, setExtension] = React.useState("js");
  const extensionOptions = ["js", "ts", "tsx", "jsx", "json", "css", "html", "md"];
  const handleClose = () => {
    setFilename("");
    setExtension("js");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filename.trim()) {
      onCreateFile(filename.trim(), extension || "js");
      setFilename("");
      setExtension("js");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Create New File</DialogTitle>
          <DialogDescription>
            Enter a name for the new file and select its extension.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="filename">
                Filename
              </Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                autoFocus
                placeholder="main"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extension">
                Extension
              </Label>
              <Select value={extension} onValueChange={setExtension}>
                <SelectTrigger id="extension" className="w-full">
                  <SelectValue placeholder="Select extension" />
                </SelectTrigger>
                <SelectContent>
                  {extensionOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!filename.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewFileDialog;   
