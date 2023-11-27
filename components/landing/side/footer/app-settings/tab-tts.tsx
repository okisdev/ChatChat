import { useTranslations } from 'next-intl';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TabTTS = ({
    synth,
    voices,
    ttsVoice,
    ttsSpeed,
    ttsPitch,
    ttsSample,
    isSpeaking,
    setTTSVoice,
    setTTSSpeed,
    setTTSPitch,
    setTTSSample,
    setIsSpeaking,
}: {
    synth: SpeechSynthesis | null;
    voices: SpeechSynthesisVoice[] | null;

    ttsVoice: string;
    ttsSpeed: number;
    ttsPitch: number;
    ttsSample: string;
    isSpeaking: boolean;
    setTTSVoice: (ttsVoice: string) => void;
    setTTSSpeed: (ttsSpeed: number) => void;
    setTTSPitch: (ttsPitch: number) => void;
    setTTSSample: (ttsSample: string) => void;
    setIsSpeaking: (isSpeaking: boolean) => void;
}) => {
    const t = useTranslations('');

    return voices && voices.length > 0 ? (
        <div className='space-y-6'>
            <div className='flex flex-row items-center justify-between space-x-1'>
                <Label>{t('Voice')}</Label>
                <Select value={ttsVoice} onValueChange={(value: string) => setTTSVoice(value)}>
                    <SelectTrigger className='w-[300px]'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='h-[300px] overflow-auto'>
                        {voices.map((voice) => {
                            return (
                                <SelectItem key={voice.name} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>
            <div className='flex flex-col space-y-5'>
                <Label>
                    {t('Speaking Speed')}: {ttsSpeed}
                </Label>
                <Slider min={0.1} max={10} step={0.1} value={[ttsSpeed]} onValueChange={([value]) => setTTSSpeed(value)} />
            </div>
            <Separator />
            <div className='flex flex-col space-y-2'>
                <Label>{t('Sample')}</Label>
                <Input value={ttsSample} onChange={(e) => setTTSSample(e.target.value)} />
                <div>
                    <Button
                        onClick={() => {
                            setIsSpeaking(true);
                            const utterance = new SpeechSynthesisUtterance(ttsSample);
                            utterance.voice = voices.find((voice) => voice.name === ttsVoice) || null;
                            utterance.rate = ttsSpeed;
                            utterance.pitch = ttsPitch;
                            synth && synth.speak(utterance);
                            utterance.onend = () => setIsSpeaking(false);
                        }}
                        disabled={isSpeaking}
                        className='inline-flex items-center justify-center space-x-2'
                    >
                        <span>{t('Speak')}</span>
                    </Button>
                </div>
            </div>
        </div>
    ) : (
        <div>
            <p>{t('Text to Speech is not supported in your browser')}</p>
        </div>
    );
};

export default TabTTS;
