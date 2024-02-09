import type { Metadata } from "next";
import SharedLayout from "@/components/shared-layout";
import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/core/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { PhotoIcon } from "@heroicons/react/20/solid";
import { FolderIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/components/core/badge";
import { Checkbox } from "@/components/core/checkbox";

export const metadata: Metadata = {
  title: "My Files",
  description: "Ah, the prison repository of wrested relics and raiments.",
};

const folders = [
  {
    id: 1,
    name: "Documents",
    href: "#",
    count: 12,
    size: "4.8MB",
    access: "Only You",
    modified: "March 16, 2020",
  },
  {
    id: 2,
    name: "Photos",
    href: "#",
    count: 8,
    size: "24MB",
    access: "Public",
    modified: "Jan 31, 2024",
  },
  {
    id: 3,
    name: "Videos",
    href: "#",
    count: 4,
    size: "2.4GB",
    access: "3 Members",
    modified: "Jan 14, 2024",
  },
  {
    id: 4,
    name: "Work",
    href: "#",
    count: 2,
    size: "1.5GB",
    access: "Only You",
    modified: "Feb 1, 2024",
  },
];


export default function Page() {
  return (
    <SharedLayout>
      <form className="mb-10">
        <div className="col-span-full">
          <label
            htmlFor="cover-photo"
            className="block text-sm font-medium leading-6"
          >
            Upload files
          </label>
          <div className="h-72 mt-2 flex justify-center items-center rounded-lg border border-dashed border-zinc-900/25 px-6 py-10 dark:border-zinc-100/25">
            <div className="text-center">
              <PhotoIcon
                className="mx-auto h-12 w-12 text-zinc-300"
                aria-hidden="true"
              />
              <div className="mt-4 flex justify-center text-sm leading-6 text-zinc-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 dark:bg-zinc-900"
                >
                  <span className="p-2">Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-zinc-600">
                PNG, JPG, GIF, WEBP, MP4, MKV, WEBM up to 7 GB. <br />
                Files over 100MB will be uploaded as a multipart upload.
              </p>
            </div>
          </div>
        </div>
      </form >

      <Table>
        <TableCaption>Your files and folders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2} className="max-w-[350px]">Name</TableHead>
            <TableHead>Access</TableHead>
            <TableHead className="text-right">Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {folders.map((folder) => (
            <TableRow key={folder.id}>
              <TableCell className="w-[10px]">
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium flex items-center w-[290px]">
                <FolderIcon className="w-6 h-6 mr-2" />
                {folder.name}
                <Badge className="ml-2">{folder.count}</Badge>
                <span className="ml-auto">{folder.size}</span>
              </TableCell>
              <TableCell>{folder.access}</TableCell>
              <TableCell className="text-right">{folder.modified}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-6">
        <PaginationPrevious href="?page=1" />
        <PaginationList>
          <PaginationPage href="?page=1" current>1</PaginationPage>
          <PaginationPage href="?page=2">2</PaginationPage>
          <PaginationGap />
          <PaginationPage href="?page=3">3</PaginationPage>
        </PaginationList>
        <PaginationNext href="?page=3" />
      </Pagination>
    </SharedLayout >
  );
}
