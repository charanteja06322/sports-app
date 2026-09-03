import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';

const STEPS = ['Details', 'Setup', 'Toss', 'Playing XI', 'Opening', 'Confirm'];
const TEAMS = ['Falcons CC', 'Warriors XI', 'Tigers XI', 'Kings CC', 'Titans XI', 'Royals CC', 'Strikers XI', 'Eagles CC'];
const FORMATS = ['T20', 'T10', 'ODI', 'Custom'];
const TYPES = ['Competitive', 'Friendly', 'Practice'];

const PLAYERS_A = [
  { name: 'Rohit Sharma', role: 'Captain' },
  { name: 'Arjun Reddy', role: 'Batter' },
  { name: 'Vikram Singh', role: 'Batter' },
  { name: 'Karthik Nair', role: 'All-Rounder' },
  { name: 'Suresh Raina', role: 'Batter' },
  { name: 'Manish Pandey', role: 'Wicket-Keeper' },
  { name: 'Ravindra Jadeja', role: 'All-Rounder' },
  { name: 'Jasprit Bumrah', role: 'Bowler' },
  { name: 'Yuzvendra Chahal', role: 'Bowler' },
  { name: 'Mohammed Shami', role: 'Bowler' },
  { name: 'Hardik Pandya', role: 'All-Rounder' },
];

const PLAYERS_B = [
  { name: 'Manoj Kumar', role: 'Captain' },
  { name: 'Rahul Dev', role: 'Batter' },
  { name: 'Sahil Khan', role: 'Batter' },
  { name: 'Pradeep Yadav', role: 'All-Rounder' },
  { name: 'Amit Verma', role: 'Batter' },
  { name: 'Sanjay Gupta', role: 'Wicket-Keeper' },
  { name: 'Deepak Hooda', role: 'All-Rounder' },
  { name: 'Kuldeep Yadav', role: 'Bowler' },
  { name: 'Bhuvneshwar Kumar', role: 'Bowler' },
  { name: 'Mohammed Siraj', role: 'Bowler' },
  { name: 'Shardul Thakur', role: 'Bowler' },
];

export default function CreateMatchScreen({ navigation }: any) {
  const [step, setStep] = useState(0);
  const [teamA, setTeamA] = useState('Falcons CC');
  const [teamB, setTeamB] = useState('Warriors XI');
  const [format, setFormat] = useState('T20');
  const [matchType, setMatchType] = useState('Competitive');
  const [venue, setVenue] = useState('Rajiv Cricket Ground, Hyderabad');
  const [date, setDate] = useState('18 May 2025');
  const [time, setTime] = useState('04:00 PM');
  const [overs, setOvers] = useState('20');
  const [tossWinner, setTossWinner] = useState('');
  const [tossDecision, setTossDecision] = useState('');
  const [selA, setSelA] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [selB, setSelB] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [ob1, setOb1] = useState(1);
  const [ob2, setOb2] = useState(2);
  const [obw, setObw] = useState(0);

  const goNext = () => { if (step < STEPS.length - 1) setStep(step + 1); };
  const goBack = () => { if (step > 0) setStep(step - 1); else navigation.goBack(); };
  const toggle = (arr: number[], setArr: React.Dispatch<React.SetStateAction<number[]>>, i: number) =>
    setArr(arr.includes(i) ? arr.filter((x) => x !== i) : [...arr, i]);
  const canGo = () => {
    if (step === 0) return teamA !== '' && teamB !== '' && teamA !== teamB;
    if (step === 2) return tossWinner !== '' && tossDecision !== '';
    if (step === 3) return selA.length > 0 && selB.length > 0;
    return true;
  };

  const handleFinish = () => {
    Alert.alert('✓ Match Started!', `${tossWinner} won the toss and elected to ${tossDecision}.`, [
      { 
        text: 'View Live', 
        onPress: () => {
          navigation.popToTop();
          navigation.navigate('MainTabs', { screen: 'Matches' });
        }
      },
      { text: 'Go Back', style: 'default', onPress: () => navigation.goBack() },
    ]);
  };

  const progress = `${((step + 1) / STEPS.length) * 100}%`;

  const Chip = ({ label, active, onPress }: any) => (
    <TouchableOpacity style={[s.chip, active && s.chipA]} onPress={onPress}>
      <Text style={[s.chipT, active && s.chipTA]}>{label}</Text>
    </TouchableOpacity>
  );

  const PlayerRow = ({ name, role, active, onPress, captain }: any) => (
    <TouchableOpacity style={[s.pr, active && s.prA]} onPress={onPress}>
      <View style={[s.pchk, active && s.pchkA]}>
        {active && <Text style={s.pchkM}>✓</Text>}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.pn}>{name}</Text>
        <Text style={s.prole}>{role}</Text>
      </View>
      {captain && <View style={s.capBadge}><Text style={s.capText}>C</Text></View>}
    </TouchableOpacity>
  );

  const renderDetails = () => (
    <View style={s.sc}>
      <Text style={s.st}>Match Details</Text>
      <Text style={s.ss}>Fill in the basic information</Text>
      <Text style={s.fl}>Team A</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {TEAMS.map((t) => <Chip key={t} label={t} active={teamA === t} onPress={() => setTeamA(t)} />)}
      </ScrollView>
      <Text style={s.fl}>Team B</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {TEAMS.filter((t) => t !== teamA).map((t) => <Chip key={t} label={t} active={teamB === t} onPress={() => setTeamB(t)} />)}
      </ScrollView>
      <Text style={s.fl}>Match Format</Text>
      <View style={s.cr}>
        {FORMATS.map((f) => <Chip key={f} label={f} active={format === f} onPress={() => setFormat(f)} />)}
      </View>
      <Text style={s.fl}>Match Type</Text>
      <View style={s.cr}>
        {TYPES.map((t) => <Chip key={t} label={t} active={matchType === t} onPress={() => setMatchType(t)} />)}
      </View>
      <Text style={s.fl}>Venue</Text>
      <TextInput style={s.inp} value={venue} onChangeText={setVenue} placeholderTextColor={colors.textMuted} />
      <View style={s.fr}>
        <View style={{ flex: 1 }}><Text style={s.fl}>Date</Text><TextInput style={s.inp} value={date} onChangeText={setDate} placeholderTextColor={colors.textMuted} /></View>
        <View style={{ flex: 1 }}><Text style={s.fl}>Time</Text><TextInput style={s.inp} value={time} onChangeText={setTime} placeholderTextColor={colors.textMuted} /></View>
      </View>
      <Text style={s.fl}>Overs</Text>
      <View style={s.cr}>
        {['10', '20', '50'].map((o) => <Chip key={o} label={`${o} Overs`} active={overs === o} onPress={() => setOvers(o)} />)}
      </View>
      <View style={s.ir}><Text style={s.il}>Players / Squads</Text><Text style={s.iv}>11 vs 11</Text></View>
      <View style={s.ir}><Text style={s.il}>Match Rules</Text><Text style={s.iv}>Standard Cricket Rules</Text></View>
    </View>
  );

  const renderSetup = () => (
    <View style={s.sc}>
      <Text style={s.st}>Match Setup</Text>
      <Text style={s.ss}>Review and confirm match details</Text>
      <View style={s.vsRow}>
        <View style={s.tp}><View style={s.tpb}><Text style={s.tpbT}>{teamA.slice(0, 2).toUpperCase()}</Text></View><Text style={s.tpN}>{teamA}</Text></View>
        <Text style={s.vsTxt}>VS</Text>
        <View style={s.tp}><View style={s.tpb}><Text style={s.tpbT}>{teamB.slice(0, 2).toUpperCase()}</Text></View><Text style={s.tpN}>{teamB}</Text></View>
      </View>
      {[['Format', format], ['Match Type', matchType], ['Venue', venue], ['Date', date], ['Time', time], ['Overs', `${overs} Overs`], ['Players', '11 vs 11'], ['Rules', 'Standard Cricket Rules']].map(([l, v]) => (
        <View key={l} style={s.rr}><Text style={s.rl}>{l}</Text><Text style={s.rv}>{v}</Text></View>
      ))}
    </View>
  );

  const renderToss = () => (
    <View style={s.sc}>
      <Text style={s.st}>Toss</Text>
      <Text style={s.ss}>Select the team that won the toss</Text>
      <View style={s.ttr}>
        <TouchableOpacity style={[s.ttc, tossWinner === teamA && s.ttcA]} onPress={() => setTossWinner(teamA)}>
          <View style={s.ttl}><Text style={s.ttlT}>{teamA.slice(0, 2).toUpperCase()}</Text></View>
          <Text style={s.ttn}>{teamA}</Text>
          {tossWinner === teamA && <Text style={s.ttChk}>✓</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[s.ttc, tossWinner === teamB && s.ttcA]} onPress={() => setTossWinner(teamB)}>
          <View style={s.ttl}><Text style={s.ttlT}>{teamB.slice(0, 2).toUpperCase()}</Text></View>
          <Text style={s.ttn}>{teamB}</Text>
          {tossWinner === teamB && <Text style={s.ttChk}>✓</Text>}
        </TouchableOpacity>
      </View>
      <Text style={[s.fl, { marginTop: 24 }]}>What would you like to do?</Text>
      <View style={s.cr}>
        <Chip label="🏏 Bat First" active={tossDecision === 'bat'} onPress={() => setTossDecision('bat')} />
        <Chip label="⚾ Bowl First" active={tossDecision === 'bowl'} onPress={() => setTossDecision('bowl')} />
      </View>
    </View>
  );

  const renderPlayingXI = () => (
    <View style={s.sc}>
      <Text style={s.st}>Playing XI</Text>
      <Text style={s.ss}>Select playing eleven for both teams</Text>
      <Text style={s.fl}>{teamA} ({selA.length}/11)</Text>
      <View style={s.pl}>
        {PLAYERS_A.map((p, i) => (
          <PlayerRow key={i} name={p.name} role={p.role} active={selA.includes(i)} onPress={() => toggle(selA, setSelA, i)} captain={i === 0} />
        ))}
      </View>
      <Text style={[s.fl, { marginTop: 16 }]}>{teamB} ({selB.length}/11)</Text>
      <View style={s.pl}>
        {PLAYERS_B.map((p, i) => (
          <PlayerRow key={i} name={p.name} role={p.role} active={selB.includes(i)} onPress={() => toggle(selB, setSelB, i)} captain={i === 0} />
        ))}
      </View>
    </View>
  );

  const renderOpening = () => {
    const batters = selA.map((i) => PLAYERS_A[i]);
    const bowlers = selB.map((i) => PLAYERS_B[i]);
    return (
      <View style={s.sc}>
        <Text style={s.st}>Opening Players</Text>
        <Text style={s.ss}>Set the opening batters and bowler</Text>
        <Text style={s.fl}>Select Opening Batters</Text>
        <View style={s.pl}>
          {batters.slice(0, 4).map((p, i) => (
            <PlayerRow key={i} name={p.name} role="RHB" active={ob1 === i || ob2 === i}
              onPress={() => { if (ob1 === i) { setOb1(ob2); return; } if (ob2 === i) { setOb2(ob1); return; } setOb2(i); }}
            />
          ))}
        </View>
        <Text style={[s.fl, { marginTop: 16 }]}>Select Opening Bowler</Text>
        <View style={s.pl}>
          {bowlers.slice(0, 3).map((p, i) => (
            <PlayerRow key={i} name={p.name} role="RFM" active={obw === i} onPress={() => setObw(i)} />
          ))}
        </View>
      </View>
    );
  };

  const renderConfirm = () => (
    <View style={s.sc}>
      <View style={s.cfI}><Text style={s.cfE}>✅</Text></View>
      <Text style={s.cfT}>Match is Ready!</Text>
      <Text style={s.cfS}>All set to start the match</Text>
      {[['Format', format], ['Venue', venue], ['Date & Time', `${date}, ${time}`], ['Overs', `${overs} Overs`], ['Toss', `${tossWinner} won the toss`], ['Decision', tossDecision === 'bat' ? 'Bat First' : 'Bowl First']].map(([l, v]) => (
        <View key={l} style={s.rr}><Text style={s.rl}>{l}</Text><Text style={s.rv}>{v}</Text></View>
      ))}
      <TouchableOpacity style={[s.startBtn, { marginTop: 24 }]} onPress={handleFinish}>
        <Text style={s.startBtnT}>🏏 Start Match & Begin Scoring</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={goBack}><Text style={s.back}>←</Text></TouchableOpacity>
        <Text style={s.ht}>{STEPS[step]}</Text>
        <Text style={s.sc2}>{step + 1}/{STEPS.length}</Text>
      </View>
      <View style={s.pBar}><View style={[s.pFill, { width: progress as any }]} /></View>
      <View style={s.dots}>
        {STEPS.map((_, i) => (
          <View key={i} style={[s.dot, i <= step && s.dotA]}>
            <Text style={[s.dotT, i <= step && s.dotTA]}>{i + 1}</Text>
          </View>
        ))}
      </View>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {step === 0 && renderDetails()}
        {step === 1 && renderSetup()}
        {step === 2 && renderToss()}
        {step === 3 && renderPlayingXI()}
        {step === 4 && renderOpening()}
        {step === 5 && renderConfirm()}
      </ScrollView>
      {step < 5 && (
        <View style={s.footer}>
          {step > 0 && <TouchableOpacity style={s.secBtn} onPress={goBack}><Text style={s.secBtnT}>Back</Text></TouchableOpacity>}
          <TouchableOpacity style={[s.priBtn, !canGo() && s.priBtnD]} onPress={goNext} disabled={!canGo()}>
            <Text style={s.priBtnT}>{step === 4 ? 'Start Scoring' : 'Continue'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
  back: { fontSize: 24, color: colors.textPrimary },
  ht: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  sc2: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
  pBar: { height: 3, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 16 },
  pFill: { height: 3, backgroundColor: colors.primary, borderRadius: 2 },
  dots: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  dot: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  dotA: { backgroundColor: colors.primary, borderColor: colors.primary },
  dotT: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  dotTA: { color: colors.textLight },
  scroll: { flex: 1 },
  sc: { paddingHorizontal: 16, paddingBottom: 20 },
  st: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  ss: { fontSize: 13, color: colors.textSecondary, marginBottom: 20 },
  fl: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8, marginTop: 14 },
  cr: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginRight: 8, marginBottom: 8 },
  chipA: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipT: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  chipTA: { color: colors.textLight },
  inp: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 14, paddingVertical: 12, color: colors.textPrimary, fontSize: 14, paddingLeft: 14 },
  fr: { flexDirection: 'row', gap: 12 },
  ir: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', marginTop: 8 },
  il: { fontSize: 14, color: colors.textSecondary },
  iv: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  footer: { flexDirection: 'row', padding: 16, gap: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  priBtn: { flex: 1, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  priBtnD: { opacity: 0.4 },
  priBtnT: { fontSize: 15, fontWeight: '700', color: colors.textLight },
  secBtn: { paddingHorizontal: 24, borderRadius: 14, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  secBtnT: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  vsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 24 },
  tp: { alignItems: 'center', gap: 8 },
  tpb: { width: 60, height: 60, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  tpbT: { fontSize: 18, fontWeight: '800', color: colors.primary },
  tpN: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  vsTxt: { fontSize: 20, fontWeight: '800', color: colors.textMuted },
  rr: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  rl: { fontSize: 14, color: colors.textSecondary },
  rv: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  ttr: { flexDirection: 'row', gap: 16 },
  ttc: { flex: 1, alignItems: 'center', gap: 10, padding: 20, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.08)' },
  ttcA: { borderColor: colors.primary, backgroundColor: 'rgba(0,255,0,0.06)' },
  ttl: { width: 64, height: 64, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  ttlT: { fontSize: 20, fontWeight: '800', color: colors.primary },
  ttn: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  ttChk: { fontSize: 24, color: colors.primary, marginTop: 4 },
  pl: { gap: 6 },
  pr: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)' },
  prA: { backgroundColor: 'rgba(0,255,0,0.06)', borderWidth: 1, borderColor: 'rgba(0,255,0,0.15)' },
  pchk: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  pchkA: { backgroundColor: colors.primary, borderColor: colors.primary },
  pchkM: { fontSize: 12, fontWeight: '800', color: colors.textLight },
  pn: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  prole: { fontSize: 11, color: colors.textMuted },
  capBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,204,0,0.15)', alignItems: 'center', justifyContent: 'center' },
  capText: { fontSize: 11, fontWeight: '800', color: '#FFD700' },
  cfI: { alignItems: 'center', marginBottom: 8 },
  cfE: { fontSize: 48 },
  cfT: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  cfS: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 20 },
  startBtn: { backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  startBtnT: { fontSize: 16, fontWeight: '800', color: colors.textLight },
});
