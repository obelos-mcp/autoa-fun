
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Command {
  command: string;
  response: string;
  description?: string;
}

interface CustomCommandsConfigProps {
  initialConfig?: string;
  onConfigChange: (config: string) => void;
}

const CustomCommandsConfig = ({ initialConfig, onConfigChange }: CustomCommandsConfigProps) => {
  const [commands, setCommands] = useState<Command[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (initialConfig) {
      try {
        const parsed = JSON.parse(initialConfig);
        if (parsed.commands && Array.isArray(parsed.commands)) {
          setCommands(parsed.commands);
        }
      } catch (e) {
        console.error('Failed to parse initial config:', e);
        setCommands([]);
      }
    }
  }, [initialConfig]);

  const addCommand = () => {
    setCommands([...commands, { command: '', response: '', description: '' }]);
  };

  const removeCommand = (index: number) => {
    setCommands(commands.filter((_, i) => i !== index));
  };

  const updateCommand = (index: number, field: keyof Command, value: string) => {
    const updatedCommands = commands.map((cmd, i) => 
      i === index ? { ...cmd, [field]: value } : cmd
    );
    setCommands(updatedCommands);
  };

  const saveConfig = () => {
    // Validate commands
    const validCommands = commands.filter(cmd => cmd.command.trim() && cmd.response.trim());
    
    if (validCommands.length === 0) {
      toast({
        title: "No valid commands",
        description: "Please add at least one command with both command and response filled",
        variant: "destructive"
      });
      return;
    }

    // Clean command names (remove leading slash if present)
    const cleanedCommands = validCommands.map(cmd => ({
      ...cmd,
      command: cmd.command.replace(/^\//, '').trim()
    }));

    const config = {
      commands: cleanedCommands
    };

    onConfigChange(JSON.stringify(config, null, 2));
    
    toast({
      title: "Commands saved",
      description: `${cleanedCommands.length} command${cleanedCommands.length !== 1 ? 's' : ''} configured successfully`
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-muted-foreground">Custom Commands</Label>
        <Button onClick={addCommand} size="sm" variant="outline" className="glass-button">
          <Plus className="h-4 w-4 mr-1" />
          Add Command
        </Button>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {commands.map((command, index) => (
          <Card key={index} className="bg-muted/20 border-border">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm">Command {index + 1}</CardTitle>
                <Button 
                  onClick={() => removeCommand(index)} 
                  size="sm" 
                  variant="ghost" 
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Command (without /)</Label>
                <Input
                  value={command.command}
                  onChange={(e) => updateCommand(index, 'command', e.target.value)}
                  placeholder="start, help, info"
                  className="bg-background/50 border-border text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Response</Label>
                <Textarea
                  value={command.response}
                  onChange={(e) => updateCommand(index, 'response', e.target.value)}
                  placeholder="Bot response when this command is used"
                  className="bg-background/50 border-border text-sm h-16 resize-none"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Description (optional)</Label>
                <Input
                  value={command.description || ''}
                  onChange={(e) => updateCommand(index, 'description', e.target.value)}
                  placeholder="What this command does"
                  className="bg-background/50 border-border text-sm"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {commands.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No commands configured yet.</p>
          <p className="text-xs mt-1">Click "Add Command" to create your first custom command.</p>
        </div>
      )}

      <Button onClick={saveConfig} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
        <Save className="mr-2 h-4 w-4" />
        Save Commands
      </Button>
    </div>
  );
};

export default CustomCommandsConfig;
