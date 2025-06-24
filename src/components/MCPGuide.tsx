import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Server,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  CheckCircle,
} from "lucide-react";
import { MCPService } from "@/services/mcpService";
import { useToast } from "@/hooks/use-toast";

const MCPGuide = () => {
  const [servers, setServers] = useState(MCPService.getAllServers());
  const [newServer, setNewServer] = useState({
    name: "",
    command: "",
    args: "",
    env: "",
  });
  const [copiedCode, setCopiedCode] = useState("");
  const { toast } = useToast();

  const handleAddServer = () => {
    if (!newServer.name || !newServer.command) {
      toast({
        title: "Missing required fields",
        description: "Please provide both server name and command",
        variant: "destructive",
      });
      return;
    }

    const serverId = `mcp-${Date.now()}`;
    const server = {
      name: newServer.name,
      command: newServer.command,
      args: newServer.args ? newServer.args.split(" ") : [],
      env: newServer.env ? JSON.parse(newServer.env) : {},
    };

    MCPService.addServer(serverId, server);
    setServers(new Map(MCPService.getAllServers()));
    setNewServer({ name: "", command: "", args: "", env: "" });

    toast({
      title: "MCP Server Added",
      description: `${server.name} has been configured successfully`,
    });
  };

  const handleRemoveServer = (serverId: string) => {
    MCPService.removeServer(serverId);
    setServers(new Map(MCPService.getAllServers()));

    toast({
      title: "Server Removed",
      description: "MCP server has been removed from configuration",
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(""), 2000);

    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully`,
    });
  };

  const popularServers = [
    {
      name: "Filesystem Server",
      command: "npx",
      args: "@modelcontextprotocol/server-filesystem /path/to/allowed/files",
      description: "Access and manipulate files on your system",
    },
    {
      name: "Git Server",
      command: "npx",
      args: "@modelcontextprotocol/server-git --repository /path/to/repo",
      description: "Interact with Git repositories",
    },
    {
      name: "SQLite Server",
      command: "npx",
      args: "@modelcontextprotocol/server-sqlite --db-path /path/to/database.db",
      description: "Query and manipulate SQLite databases",
    },
    {
      name: "Brave Search",
      command: "npx",
      args: "@modelcontextprotocol/server-brave-search",
      description: "Search the web using Brave Search API",
      env: { BRAVE_API_KEY: "your-api-key" },
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            MCP (Model Context Protocol) Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="guide" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="guide">Setup Guide</TabsTrigger>
              <TabsTrigger value="servers">Configure Servers</TabsTrigger>
              <TabsTrigger value="usage">Usage in Flow</TabsTrigger>
            </TabsList>

            <TabsContent value="guide" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">What is MCP?</h3>
                  <p className="text-muted-foreground">
                    Model Context Protocol (MCP) allows AI models to securely
                    access external data sources and tools. It enables your AI
                    flows to interact with file systems, databases, APIs, and
                    more.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Installation Steps
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Install Node.js and npm</p>
                        <p className="text-sm text-muted-foreground">
                          MCP servers are typically Node.js packages
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Install MCP servers</p>
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 font-mono text-sm">
                          npm install -g @modelcontextprotocol/server-filesystem
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                        3
                      </div>
                      <div>
                        <p className="font-medium">
                          Configure servers in the "Configure Servers" tab
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Add your MCP servers with appropriate commands and
                          paths
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                        4
                      </div>
                      <div>
                        <p className="font-medium">
                          Use MCP nodes in your flow
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Drag MCP nodes into your flow and configure them
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Popular MCP Servers
                  </h3>
                  <div className="grid gap-3">
                    {popularServers.map((server, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{server.name}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(`npx ${server.args}`, server.name)
                            }
                            className="h-6"
                          >
                            {copiedCode === server.name ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {server.description}
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-xs">
                          {server.command} {server.args}
                        </div>
                        {server.env && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            Requires environment variables:{" "}
                            {Object.keys(server.env).join(", ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="servers" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Add New MCP Server
                </h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="serverName">Server Name</Label>
                    <Input
                      id="serverName"
                      placeholder="e.g., My Filesystem Server"
                      value={newServer.name}
                      onChange={(e) =>
                        setNewServer((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="command">Command</Label>
                    <Input
                      id="command"
                      placeholder="e.g., npx"
                      value={newServer.command}
                      onChange={(e) =>
                        setNewServer((prev) => ({
                          ...prev,
                          command: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="args">Arguments (space separated)</Label>
                    <Input
                      id="args"
                      placeholder="e.g., @modelcontextprotocol/server-filesystem /path/to/files"
                      value={newServer.args}
                      onChange={(e) =>
                        setNewServer((prev) => ({
                          ...prev,
                          args: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="env">Environment Variables (JSON)</Label>
                    <Textarea
                      id="env"
                      placeholder='e.g., {"API_KEY": "your-key", "DEBUG": "true"}'
                      value={newServer.env}
                      onChange={(e) =>
                        setNewServer((prev) => ({
                          ...prev,
                          env: e.target.value,
                        }))
                      }
                      className="min-h-[60px]"
                    />
                  </div>

                  <Button onClick={handleAddServer} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Server
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Configured Servers
                </h3>
                {servers.size === 0 ? (
                  <p className="text-muted-foreground">
                    No servers configured yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {Array.from(servers.entries()).map(([id, server]) => (
                      <div
                        key={id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{server.name}</div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {server.command} {server.args?.join(" ")}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveServer(id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="usage" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Using MCP in Your Flow
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-medium">
                        Drag an MCP node from the sidebar
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Find it in the "Tools" category
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Configure the node</p>
                      <p className="text-sm text-muted-foreground">
                        Select your server and tool in the node panel
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Connect inputs</p>
                      <p className="text-sm text-muted-foreground">
                        Connect data sources to provide tool arguments
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Test and run</p>
                      <p className="text-sm text-muted-foreground">
                        Use the Test Flow button to verify everything works
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Example Flow
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Input Node → MCP Node (read_file) → AI Model → Output
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    This flow reads a file using MCP, sends it to an AI model
                    for analysis, and outputs the result.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MCPGuide;
