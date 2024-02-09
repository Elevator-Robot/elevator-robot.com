"use client";
import { cn } from "@/lib/utils";
import { Fragment, useState, useEffect } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import {
  FolderIcon,
  DocumentPlusIcon,
  FolderPlusIcon,
  HashtagIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

type Project = {
  id: number;
  name: string;
  url: Window["location"];
};
const projects = [
  { id: 1, name: "Workflow Inc. / Website Redesign", url: "#" },
  // More projects...
];
const recent = [projects[0]];
const quickActions = [
  { name: "Add new file...", icon: DocumentPlusIcon, shortcut: "N", url: "#" },
  { name: "Add new folder...", icon: FolderPlusIcon, shortcut: "F", url: "#" },
  { name: "Add label...", icon: TagIcon, shortcut: "L", url: "#" },
];

const CommandPallet = () => {
  const [query, setQuery] = useState("");
  const [openQuery, setOpenQuery] = useState(false);

  const filteredProjects =
    query === ""
      ? []
      : projects.filter((project) => {
        return project.name.toLowerCase().includes(query.toLowerCase());
      });

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setOpenQuery(true);
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);

  return (
    <Transition.Root
      show={openQuery}
      as={Fragment}
      afterLeave={() => setQuery("")}
      appear
    >
      <Dialog as="div" className="relative z-[60]" onClose={setOpenQuery}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto mt-20 max-w-2xl transform divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden rounded-xl bg-white dark:bg-zinc-950 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Combobox
                onChange={(item: Project) => (window.location = item.url)}
              >
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-zinc-400"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {(query === "" || filteredProjects.length > 0) && (
                  <Combobox.Options
                    static
                    className="max-h-80 scroll-py-2 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-y-auto"
                  >
                    <li className="p-2">
                      {query === "" && (
                        <h2 className="mb-2 mt-4 px-3 text-xs font-semibold text-zinc-500">
                          Recent searches
                        </h2>
                      )}
                      <ul className="text-sm text-zinc-700 dark:text-zinc-300">
                        {(query === "" ? recent : filteredProjects).map(
                          (project) => (
                            <Combobox.Option
                              key={project.id}
                              value={project}
                              className={({ active }) =>
                                cn(
                                  "flex cursor-default select-none items-center rounded-md px-3 py-2",
                                  active ? "bg-indigo-600 text-white" : "",
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  <FolderIcon
                                    className={cn(
                                      "h-6 w-6 flex-none",
                                      active ? "text-white" : "text-zinc-400",
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span className="ml-3 flex-auto truncate">
                                    {project.name}
                                  </span>
                                  {active && (
                                    <span className="ml-3 flex-none text-indigo-100">
                                      Jump to...
                                    </span>
                                  )}
                                </>
                              )}
                            </Combobox.Option>
                          ),
                        )}
                      </ul>
                    </li>
                    {query === "" && (
                      <li className="p-2">
                        <h2 className="sr-only">Quick actions</h2>
                        <ul className="text-sm text-zinc-700 dark:text-zinc-300">
                          {quickActions.map((action) => (
                            <Combobox.Option
                              key={action.shortcut}
                              value={action}
                              className={({ active }) =>
                                cn(
                                  "flex cursor-default select-none items-center rounded-md px-3 py-2",
                                  active ? "bg-indigo-600 text-white" : "",
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  <action.icon
                                    className={cn(
                                      "h-6 w-6 flex-none",
                                      active ? "text-white" : "text-zinc-400",
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span className="ml-3 flex-auto truncate">
                                    {action.name}
                                  </span>
                                  <span
                                    className={cn(
                                      "ml-3 flex-none text-xs font-semibold",
                                      active
                                        ? "text-indigo-100"
                                        : "text-zinc-400",
                                    )}
                                  >
                                    <kbd className="font-sans">⌘</kbd>
                                    <kbd className="font-sans">
                                      {action.shortcut}
                                    </kbd>
                                  </span>
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                        </ul>
                      </li>
                    )}
                  </Combobox.Options>
                )}

                {query !== "" && filteredProjects.length === 0 && (
                  <div className="px-6 py-14 text-center sm:px-14">
                    <FolderIcon
                      className="mx-auto h-6 w-6 text-zinc-400"
                      aria-hidden="true"
                    />
                    <p className="mt-4 text-sm text-zinc-900 dark:text-zinc-100">
                      We couldn&apos;t find any projects with that term. Please
                      try again.
                    </p>
                  </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CommandPallet;
