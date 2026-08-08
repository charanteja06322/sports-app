import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

const TABS = ['Overview', 'Stats', 'Matches', 'Posts'];

export default function ProfileScreen({ navigation }: any) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerIcon}>↗️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.headerIcon}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>
                {user?.email ? user.email[0].toUpperCase() : 'R'}
              </Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.userName}>Rahul Kumar</Text>
            <Text style={styles.verifiedBadgeGreen}>✓</Text>
          </View>
          <Text style={styles.userHandle}>@rahulkumar</Text>
          
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>Hyderabad, India</Text>
          </View>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>All-Rounder</Text>
          </View>

          <View style={styles.playerInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🏏</Text>
              <Text style={styles.infoText}>Right-Handed Batter</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⚾</Text>
              <Text style={styles.infoText}>Right-Arm Medium</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageIcon}>💬</Text>
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareIcon}>↗️</Text>
              <Text style={styles.shareButtonText}>Share Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>👥</Text>
              </View>
              <Text style={styles.statValue}>2.4K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>👤</Text>
              </View>
              <Text style={styles.statValue}>386</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>📝</Text>
              </View>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          </View>
        </View>

        {/* Cricket Identity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CRICKET IDENTITY</Text>
          
          <View style={styles.identityGrid}>
            <View style={styles.identityItem}>
              <Text style={styles.identityLabel}>Role</Text>
              <Text style={styles.identityValue}>All-Rounder</Text>
            </View>
            <View style={styles.identityItem}>
              <Text style={styles.identityLabel}>Batting</Text>
              <Text style={styles.identityValue}>Right-Handed</Text>
            </View>
            <View style={styles.identityItem}>
              <Text style={styles.identityLabel}>Bowling</Text>
              <Text style={styles.identityValue}>Right-Arm Medium</Text>
            </View>
            <View style={styles.identityItem}>
              <Text style={styles.identityLabel}>Experience</Text>
              <Text style={styles.identityValue}>College • Club • Turf</Text>
            </View>
          </View>

          <View style={styles.primaryTeam}>
            <Text style={styles.primaryTeamLabel}>Primary Team</Text>
            <View style={styles.teamRow}>
              <View style={styles.teamLogo}>
                <Text style={styles.teamLogoText}>FC</Text>
              </View>
              <Text style={styles.teamName}>Falcons CC</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'Overview' && (
            <View>
              {/* Recent Performance */}
              <View style={styles.contentSection}>
                <View style={styles.contentHeader}>
                  <Text style={styles.contentTitle}>Recent Performance</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.performanceCards}>
                  <View style={styles.performanceCard}>
                    <View style={styles.performanceHeader}>
                      <Text style={styles.performanceScore}>86*</Text>
                      <Text style={styles.performanceCount}>(52)</Text>
                      <Text style={styles.performanceIcon}>🏏</Text>
                    </View>
                    <Text style={styles.performanceDetail}>7 Fours • 3 Sixes</Text>
                    <Text style={styles.performanceVs}>vs Royal Strikers</Text>
                    <Text style={styles.performanceDate}>Yesterday</Text>
                    <TouchableOpacity style={styles.performanceArrow}>
                      <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.performanceCard}>
                    <View style={styles.performanceHeader}>
                      <Text style={styles.performanceScore}>42</Text>
                      <Text style={styles.performanceCount}>(31)</Text>
                      <Text style={styles.performanceIcon}>🏏</Text>
                    </View>
                    <Text style={styles.performanceDetail}>5 Fours • 1 Six</Text>
                    <Text style={styles.performanceVs}>vs Warriors XI</Text>
                    <Text style={styles.performanceDate}>3 days ago</Text>
                    <TouchableOpacity style={styles.performanceArrow}>
                      <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.performanceCard}>
                    <View style={styles.performanceHeader}>
                      <Text style={styles.performanceScore}>3/24</Text>
                      <Text style={styles.performanceCount}>(4)</Text>
                      <Text style={styles.performanceIcon}>⚾</Text>
                    </View>
                    <Text style={styles.performanceDetail}>4 Overs</Text>
                    <Text style={styles.performanceVs}>vs Titans CC</Text>
                    <Text style={styles.performanceDate}>5 days ago</Text>
                    <TouchableOpacity style={styles.performanceArrow}>
                      <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Form Section */}
              <View style={styles.contentSection}>
                <Text style={styles.contentTitle}>Form (Last 5 Matches)</Text>
                <View style={styles.formChart}>
                  <View style={styles.formBars}>
                    <View style={[styles.formBar, { height: 60 }]}>
                      <Text style={styles.formValue}>84</Text>
                    </View>
                    <View style={[styles.formBar, { height: 80 }]}>
                      <Text style={styles.formValue}>42</Text>
                    </View>
                    <View style={[styles.formBar, { height: 35 }]}>
                      <Text style={styles.formValue}>31</Text>
                    </View>
                    <View style={[styles.formBar, { height: 45 }]}>
                      <Text style={styles.formValue}>18</Text>
                    </View>
                    <View style={[styles.formBar, { height: 25 }]}>
                      <Text style={styles.formValue}>74</Text>
                    </View>
                  </View>
                  <View style={styles.formLabels}>
                    <View style={styles.formLabel}>
                      <Text style={[styles.formResult, styles.formWin]}>W</Text>
                    </View>
                    <View style={styles.formLabel}>
                      <Text style={[styles.formResult, styles.formWin]}>W</Text>
                    </View>
                    <View style={styles.formLabel}>
                      <Text style={[styles.formResult, styles.formLoss]}>L</Text>
                    </View>
                    <View style={styles.formLabel}>
                      <Text style={[styles.formResult, styles.formWin]}>W</Text>
                    </View>
                    <View style={styles.formLabel}>
                      <Text style={[styles.formResult, styles.formLoss]}>L</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Teams */}
              <View style={styles.contentSection}>
                <View style={styles.contentHeader}>
                  <Text style={styles.contentTitle}>Teams</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.teamCard}>
                  <View style={styles.teamLogo}>
                    <Text style={styles.teamLogoText}>FC</Text>
                  </View>
                  <View style={styles.teamInfo}>
                    <Text style={styles.teamCardName}>Falcons CC</Text>
                    <Text style={styles.teamRole}>All-Rounder</Text>
                  </View>
                  <Text style={styles.teamYear}>2025 - Present</Text>
                </View>

                <View style={styles.teamCard}>
                  <View style={styles.teamLogo}>
                    <Text style={styles.teamLogoText}>WX</Text>
                  </View>
                  <View style={styles.teamInfo}>
                    <Text style={styles.teamCardName}>Warriors XI</Text>
                    <Text style={styles.teamRole}>All-Rounder</Text>
                  </View>
                  <Text style={styles.teamYear}>2024 - 2025</Text>
                </View>
              </View>

              {/* Tournaments */}
              <View style={styles.contentSection}>
                <View style={styles.contentHeader}>
                  <Text style={styles.contentTitle}>Tournaments</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.tournamentCard}>
                  <Text style={styles.tournamentIcon}>🏆</Text>
                  <View style={styles.tournamentInfo}>
                    <Text style={styles.tournamentName}>Kurukshetra T20</Text>
                    <Text style={styles.tournamentStatus}>Semi-Final • 2026</Text>
                  </View>
                  <View style={styles.tournamentBadge}>
                    <Text style={styles.tournamentBadgeText}>Top Performer</Text>
                  </View>
                </View>

                <View style={styles.tournamentCard}>
                  <Text style={styles.tournamentIcon}>🏆</Text>
                  <View style={styles.tournamentInfo}>
                    <Text style={styles.tournamentName}>Hyderabad Turf League</Text>
                    <Text style={styles.tournamentStatus}>Winner • 2026</Text>
                  </View>
                </View>
              </View>

              {/* Achievements */}
              <View style={styles.contentSection}>
                <View style={styles.contentHeader}>
                  <Text style={styles.contentTitle}>Achievements</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.achievementCard}>
                  <Text style={styles.achievementIcon}>⭐</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>Player of the Match</Text>
                    <Text style={styles.achievementCount}>8 Times</Text>
                  </View>
                </View>

                <View style={styles.achievementCard}>
                  <Text style={styles.achievementIcon}>🏏</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>500 Career Runs</Text>
                    <Text style={styles.achievementCount}>Milestone</Text>
                  </View>
                </View>

                <View style={styles.achievementCard}>
                  <Text style={styles.achievementIcon}>🎯</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>50 Wickets</Text>
                    <Text style={styles.achievementCount}>Career Milestone</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'Stats' && (
            <View style={styles.statsContainer}>
              {/* Batting */}
              <View style={styles.statsSection}>
                <View style={styles.statsSectionHeader}>
                  <Text style={styles.statsSectionIcon}>🏏</Text>
                  <Text style={styles.statsSectionTitle}>Batting</Text>
                  <TouchableOpacity style={styles.statsDropdown}>
                    <Text style={styles.statsDropdownText}>All Formats</Text>
                    <Text style={styles.statsDropdownArrow}>▾</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.statsGrid}>
                  <View style={styles.statBox}><Text style={styles.statBoxLabel}>Matches</Text><Text style={styles.statBoxValue}>42</Text></View>
                  <View style={styles.statBox}><Text style={styles.statBoxLabel}>Runs</Text><Text style={styles.statBoxValue}>1,286</Text></View>
                  <View style={styles.statBox}><Text style={styles.statBoxLabel}>Average</Text><Text style={[styles.statBoxValue, styles.statBoxHighlight]}>38.7</Text></View>
                  <View style={styles.statBox}><Text style={styles.statBoxLabel}>Strike Rate</Text><Text style={[styles.statBoxValue, styles.statBoxHighlight]}>142.4</Text></View>
                </View>
                <View style={styles.statsDetailRow}>
                  <View style={styles.statDetail}><Text style={styles.statDetailLabel}>HS</Text><Text style={styles.statDetailValue}>86*</Text></View>
                  <View style={styles.statDetail}><Text style={styles.statDetailLabel}>50s</Text><Text style={styles.statDetailValue}>12</Text></View>
                  <View style={styles.statDetail}><Text style={styles.statDetailLabel}>100s</Text><Text style={styles.statDetailValue}>2</Text></View>
                  <View style={styles.statDetail}><Text style={styles.statDetailLabel}>4s</Text><Text style={styles.statDetailValue}>134</Text></View>
                  <View style={styles.statDetail}><Text style={styles.statDetailLabel}>6s</Text><Text style={styles.statDetailValue}>58</Text></View>
                </View>
              </View>

              {/* Bowling */}
              <View style={styles.statsSection}>
                <View style={styles.statsSectionHeader}>
                  <Text style={styles.statsSectionIcon}>🏐</Text>
                  <Text style={styles.statsSectionTitle}>Bowling</Text>
                  <TouchableOpacity style={styles.statsDropdown}>
                    <Text style={styles.statsDropdownText}>All Formats</Text>
                    <Text style={styles.statsDropdownArrow}>▾</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.statsGrid}>
                  <View style={styles.statBox}><Text style={styles.statBoxLabel}>Matches</Text><Text style={styles.statBoxValue}>42</Text></View>
                  <View style={styles.statBox}><Text style={styles.statBoxLabel}>Overs</Text><Text style={styles.statBoxValue}>126.4</Text></View>
                  <View style={styles.statBox}><Text style={styles.statBoxLabel}>Wickets</Text><Text style={[styles.statBoxValue, styles.statBoxHighlight]}>58</Text></View>
                  <View style={styles.statBox}><Text style={styles.statBoxLabel}>Economy</Text><Text style={[styles.statBoxValue, styles.statBoxHighlight]}>7.2</Text></View>
                </View>
                <View style={styles.statsDetailRow}>
                  <View style={styles.statDetail}><Text style={styles.statDetailLabel}>Best</Text><Text style={styles.statDetailValue}>4/18</Text></View>
                  <View style={styles.statDetail}><Text style={styles.statDetailLabel}>5W</Text><Text style={styles.statDetailValue}>1</Text></View>
                  <View style={styles.statDetail}><Text style={styles.statDetailLabel}>Maidens</Text><Text style={styles.statDetailValue}>6</Text></View>
                  <View style={styles.statDetail}><Text style={styles.statDetailLabel}>Dot Balls</Text><Text style={styles.statDetailValue}>312</Text></View>
                </View>
              </View>

              {/* Fielding */}
              <View style={styles.statsSection}>
                <View style={styles.statsSectionHeader}>
                  <Text style={styles.statsSectionIcon}>🧤</Text>
                  <Text style={styles.statsSectionTitle}>Fielding</Text>
                </View>
                <View style={styles.statsGrid}>
                  <View style={styles.statBox}><Text style={styles.statBoxLabel}>Catches</Text><Text style={[styles.statBoxValue, styles.statBoxHighlight]}>32</Text></View>
                  <View style={styles.statBox}><Text style={styles.statBoxLabel}>Run Outs</Text><Text style={styles.statBoxValue}>7</Text></View>
                  <View style={styles.statBox}><Text style={styles.statBoxLabel}>Stumpings</Text><Text style={styles.statBoxValue}>3</Text></View>
                  <View style={styles.statBox}><Text style={styles.statBoxLabel}>Direct Hits</Text><Text style={styles.statBoxValue}>2</Text></View>
                </View>
              </View>

              {/* Performance Trend */}
              <View style={styles.statsSection}>
                <View style={styles.statsSectionHeader}>
                  <Text style={styles.statsSectionTitle}>Performance Trend</Text>
                  <Text style={styles.statsSubtitle}>Last 10 Innings</Text>
                  <TouchableOpacity style={styles.statsDropdown}>
                    <Text style={styles.statsDropdownText}>Runs</Text>
                    <Text style={styles.statsDropdownArrow}>▾</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.trendChart}>
                  {[18, 74, 31, 86, 42, 0, 55, 24, 67, 33].map((val, i) => (
                    <View key={i} style={styles.trendBarWrap}>
                      <Text style={styles.trendBarLabel}>{val === 86 ? '86*' : val}</Text>
                      <View style={[styles.trendBar, { height: Math.max(8, val * 1.1) }]} />
                      <Text style={[styles.trendResult, val >= 30 ? styles.trendWin : styles.trendLoss]}>
                        {['W','W','L','W','W','L','W','L','W','W'][i]}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {activeTab === 'Matches' && (
            <View style={styles.matchesContainer}>
              {/* Match Summary */}
              <View style={styles.matchSummaryCard}>
                <View style={styles.matchSummaryHeader}>
                  <Text style={styles.matchSummaryTitle}>Match Summary</Text>
                  <TouchableOpacity style={styles.statsDropdown}>
                    <Text style={styles.statsDropdownText}>All Formats</Text>
                    <Text style={styles.statsDropdownArrow}>▾</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.matchSummaryRow}>
                  <View style={styles.matchSummaryItem}><Text style={styles.matchSummaryValue}>42</Text><Text style={styles.matchSummaryLabel}>Matches</Text></View>
                  <View style={styles.matchSummaryItem}><Text style={styles.matchSummaryValue}>26</Text><Text style={styles.matchSummaryLabel}>Won</Text></View>
                  <View style={styles.matchSummaryItem}><Text style={[styles.matchSummaryValue, styles.statBoxHighlight]}>61.9%</Text><Text style={styles.matchSummaryLabel}>Win %</Text></View>
                  <View style={styles.matchSummaryItem}><Text style={styles.matchSummaryValue}>8</Text><Text style={styles.matchSummaryLabel}>POTM</Text></View>
                </View>
              </View>

              {/* Match History */}
              <View style={styles.matchHistorySection}>
                <View style={styles.matchHistoryHeader}>
                  <Text style={styles.matchHistoryTitle}>📅 Match History</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.formatFilters}>
                  {['All', 'T20', 'ODI', 'T10', 'Turf', 'College'].map((f, i) => (
                    <TouchableOpacity key={f} style={[styles.formatChip, i === 0 && styles.formatChipActive]}>
                      <Text style={[styles.formatChipText, i === 0 && styles.formatChipTextActive]}>{f}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {[
                  { time: 'Yesterday', league: 'T20 • Kurukshetra T20 • Semi-Final', a: 'Falcons CC', b: 'Royal Strikers', result: 'Won by 6 wickets', won: true, perf: '86* (52)', detail: '7 Fours • 3 Sixes', badge: 'POTM' },
                  { time: '3 days ago', league: 'T20 • Hyderabad Turf League • League', a: 'Warriors XI', b: 'Falcons CC', result: 'Lost by 3 runs', won: false, perf: '42 (31)', detail: '5 Fours • 1 Six', badge: '' },
                  { time: '5 days ago', league: 'T20 • Hyderabad Turf League • League', a: 'Falcons CC', b: 'Titans CC', result: 'Won by 22 runs', won: true, perf: '3/24 (4)', detail: '4 Overs • 2 Maidens', badge: '' },
                  { time: '1 week ago', league: 'T10 • College Premier League', a: 'Strikers XI', b: 'Falcons CC', result: 'Won by 8 wickets', won: true, perf: '74 (40)', detail: '6 Fours • 4 Sixes', badge: '' },
                  { time: '1 week ago', league: 'T20 • Kurukshetra T20 • League', a: 'Falcons CC', b: 'Thunder CC', result: 'Won by 4 wickets', won: true, perf: '31 (26)', detail: '4 Fours • 1 Six', badge: '' },
                ].map((m, i) => (
                  <TouchableOpacity key={i} style={styles.historyCard} activeOpacity={0.85}>
                    <View style={styles.historyTop}>
                      <Text style={styles.historyTime}>{m.time}</Text>
                      <Text style={styles.historyLeague}>{m.league}</Text>
                    </View>
                    <View style={styles.historyTeams}>
                      <Text style={styles.historyTeamA}>{m.a}</Text>
                      <Text style={styles.historyVs}>vs</Text>
                      <Text style={styles.historyTeamB}>{m.b}</Text>
                    </View>
                    <Text style={[styles.historyResult, m.won ? styles.historyWin : styles.historyLoss]}>{m.result}</Text>
                    <View style={styles.historyPerf}>
                      <Text style={styles.historyPerfValue}>{m.perf}</Text>
                      <Text style={styles.historyPerfDetail}>— {m.detail}</Text>
                      {m.badge ? <View style={styles.historyBadge}><Text style={styles.historyBadgeText}>⭐ {m.badge}</Text></View> : null}
                    </View>
                    <Text style={styles.historyArrow}>›</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.viewAllMatches}>
                  <Text style={styles.viewAllMatchesText}>View All Matches</Text>
                  <Text style={styles.viewAllMatchesArrow}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeTab === 'Posts' && (
            <View style={styles.postsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.postFilters}>
                {[
                  { label: 'All Posts', icon: '📋' },
                  { label: 'Photos', icon: '📷' },
                  { label: 'Videos', icon: '▶️' },
                  { label: 'Performances', icon: '📊' },
                ].map((f, i) => (
                  <TouchableOpacity key={f.label} style={[styles.postFilterChip, i === 0 && styles.postFilterChipActive]}>
                    <Text style={styles.postFilterIcon}>{f.icon}</Text>
                    <Text style={[styles.postFilterText, i === 0 && styles.postFilterTextActive]}>{f.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {[
                { time: '2h ago', text: 'Big match tonight! 🦅 Let\'s go Falcons! 🔥', image: '🏏', likes: 128, comments: 24, shares: 12 },
                { time: '1d ago', text: 'Happy to contribute to the team\'s win today. 👏 Good team effort all around! 🌟', image: '🏆', likes: 96, comments: 18, shares: 8, hasMatchCard: true },
                { time: '3d ago', text: 'Great practice session today! Always working to get better. 🏏', image: '🏏', likes: 78, comments: 14, shares: 6, gallery: true },
              ].map((p, i) => (
                <View key={i} style={styles.postItem}>
                  <View style={styles.postItemHeader}>
                    <View style={styles.postAvatar}>
                      <Text style={styles.postAvatarText}>R</Text>
                    </View>
                    <View style={styles.postAuthorBlock}>
                      <Text style={styles.postAuthorName}>Rahul Kumar</Text>
                      <Text style={styles.postTime}>{p.time}</Text>
                    </View>
                    <TouchableOpacity><Text style={styles.postMenuIcon}>⋮</Text></TouchableOpacity>
                  </View>
                  <Text style={styles.postText}>{p.text}</Text>
                  {p.hasMatchCard ? (
                    <View style={styles.postMatchCard}>
                      <Text style={styles.postMatchLabel}>⭐ Player of the Match</Text>
                      <Text style={styles.postMatchScore}>86* (52) — 7 Fours • 3 Sixes</Text>
                      <Text style={styles.postMatchMeta}>vs Royal Strikers • Won by 6 wickets • T20 League</Text>
                    </View>
                  ) : (
                    <View style={styles.postImagePlaceholder}>
                      <Text style={styles.postImageEmoji}>{p.image}</Text>
                      {p.gallery && (
                        <View style={styles.postGalleryRow}>
                          <View style={styles.postGalleryThumb}><Text style={styles.postGalleryEmoji}>🏏</Text></View>
                          <View style={styles.postGalleryThumb}><Text style={styles.postGalleryEmoji}>⚾</Text></View>
                        </View>
                      )}
                    </View>
                  )}
                  <View style={styles.postEngagement}>
                    <TouchableOpacity style={styles.postEngageButton}><Text style={styles.postEngageIcon}>❤️</Text><Text style={styles.postEngageText}>{p.likes}</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.postEngageButton}><Text style={styles.postEngageIcon}>💬</Text><Text style={styles.postEngageText}>{p.comments}</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.postEngageButton}><Text style={styles.postEngageIcon}>🔁</Text><Text style={styles.postEngageText}>{p.shares}</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.postEngageButton}><Text style={styles.postEngageIcon}>📌</Text></TouchableOpacity>
                  </View>
                </View>
              ))}

              <View style={styles.postsEnd}>
                <Text style={styles.postsEndIcon}>✏️</Text>
                <Text style={styles.postsEndText}>No more posts yet</Text>
                <Text style={styles.postsEndSub}>New posts will appear here.</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 4,
  },
  headerIcon: {
    fontSize: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundCard,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  verifiedIcon: {
    fontSize: 14,
    color: '#000000',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  verifiedBadgeGreen: {
    fontSize: 20,
    color: colors.primary,
  },
  userHandle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 14,
  },
  locationText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  roleBadge: {
    backgroundColor: 'rgba(0, 255, 0, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  playerInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoIcon: {
    fontSize: 14,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 24,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  messageIcon: {
    fontSize: 16,
  },
  messageButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundCard,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  shareIcon: {
    fontSize: 16,
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 16,
  },
  identityGrid: {
    gap: 16,
    marginBottom: 20,
  },
  identityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  identityLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  identityValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  primaryTeam: {
    marginTop: 12,
  },
  primaryTeamLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teamLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamLogoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  teamName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    paddingBottom: 40,
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  performanceCards: {
    flexDirection: 'row',
    gap: 12,
  },
  performanceCard: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  performanceScore: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  performanceCount: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  performanceIcon: {
    fontSize: 16,
    marginLeft: 'auto',
  },
  performanceDetail: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  performanceVs: {
    fontSize: 12,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  performanceDate: {
    fontSize: 11,
    color: colors.textMuted,
  },
  performanceArrow: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  arrowIcon: {
    fontSize: 20,
    color: colors.textMuted,
  },
  formChart: {
    marginTop: 16,
  },
  formBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 12,
  },
  formBar: {
    width: 50,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  formValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  formLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formLabel: {
    width: 50,
    alignItems: 'center',
  },
  formResult: {
    fontSize: 13,
    fontWeight: '700',
    width: 28,
    height: 28,
    textAlign: 'center',
    lineHeight: 28,
    borderRadius: 14,
  },
  formWin: {
    color: colors.primary,
    backgroundColor: 'rgba(0, 255, 0, 0.15)',
  },
  formLoss: {
    color: colors.error,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  teamInfo: {
    flex: 1,
    marginLeft: 12,
  },
  teamCardName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  teamRole: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  teamYear: {
    fontSize: 12,
    color: colors.textMuted,
  },
  tournamentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tournamentIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  tournamentStatus: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  tournamentBadge: {
    backgroundColor: 'rgba(0, 255, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tournamentBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  achievementCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  /* ── Stats Tab ── */
  statsContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, gap: 20 },
  statsSection: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
  },
  statsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  statsSectionIcon: { fontSize: 18 },
  statsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  statsSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 'auto',
  },
  statsDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  statsDropdownText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  statsDropdownArrow: { fontSize: 10, color: colors.textMuted },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  statBox: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statBoxLabel: { fontSize: 11, color: colors.textMuted, marginBottom: 6 },
  statBoxValue: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  statBoxHighlight: { color: colors.primary },
  statsDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  statDetail: { alignItems: 'center', flex: 1 },
  statDetailLabel: { fontSize: 10, color: colors.textMuted, marginBottom: 4 },
  statDetailValue: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  trendChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingTop: 10,
  },
  trendBarWrap: { alignItems: 'center', flex: 1 },
  trendBarLabel: { fontSize: 9, color: colors.textPrimary, marginBottom: 4, fontWeight: '600' },
  trendBar: { width: 22, backgroundColor: colors.primary, borderRadius: 6 },
  trendResult: { fontSize: 10, fontWeight: '700', marginTop: 6, width: 24, height: 24, textAlign: 'center', lineHeight: 24, borderRadius: 12 },
  trendWin: { color: colors.primary, backgroundColor: 'rgba(0,255,0,0.12)' },
  trendLoss: { color: colors.error, backgroundColor: 'rgba(255,59,48,0.12)' },

  /* ── Matches Tab ── */
  matchesContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  matchSummaryCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  matchSummaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  matchSummaryTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  matchSummaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  matchSummaryItem: { alignItems: 'center', flex: 1 },
  matchSummaryValue: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  matchSummaryLabel: { fontSize: 11, color: colors.textSecondary },
  matchHistorySection: { gap: 10 },
  matchHistoryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  matchHistoryTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  formatFilters: { marginBottom: 6 },
  formatChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginRight: 8,
  },
  formatChipActive: { backgroundColor: colors.primary },
  formatChipText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  formatChipTextActive: { color: '#000000' },
  historyCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    position: 'relative',
  },
  historyTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  historyTime: { fontSize: 12, fontWeight: '700', color: colors.primary },
  historyLeague: { fontSize: 10, color: colors.textMuted },
  historyTeams: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  historyTeamA: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  historyVs: { fontSize: 12, color: colors.textMuted },
  historyTeamB: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  historyResult: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  historyWin: { color: colors.primary },
  historyLoss: { color: colors.error },
  historyPerf: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  historyPerfValue: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  historyPerfDetail: { fontSize: 11, color: colors.textSecondary },
  historyBadge: { backgroundColor: 'rgba(255,204,0,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  historyBadgeText: { fontSize: 10, fontWeight: '700', color: '#FFD700' },
  historyArrow: { position: 'absolute', bottom: 14, right: 14, fontSize: 22, color: colors.textMuted },
  viewAllMatches: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginTop: 4,
  },
  viewAllMatchesText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  viewAllMatchesArrow: { fontSize: 18, color: colors.primary },

  /* ── Posts Tab ── */
  postsContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  postFilters: { marginBottom: 14 },
  postFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginRight: 8,
  },
  postFilterChipActive: { backgroundColor: colors.primary },
  postFilterIcon: { fontSize: 13 },
  postFilterText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  postFilterTextActive: { color: '#000000' },
  postItem: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  postItemHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,255,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  postAvatarText: { fontSize: 16, fontWeight: '700', color: colors.primary },
  postAuthorBlock: { flex: 1 },
  postAuthorName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  postTime: { fontSize: 11, color: colors.textMuted },
  postMenuIcon: { fontSize: 18, color: colors.textMuted },
  postText: { fontSize: 15, color: colors.textPrimary, marginBottom: 12, lineHeight: 22 },
  postImagePlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  postImageEmoji: { fontSize: 48 },
  postGalleryRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  postGalleryThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postGalleryEmoji: { fontSize: 24 },
  postMatchCard: {
    backgroundColor: 'rgba(0,255,0,0.06)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,255,0,0.12)',
  },
  postMatchLabel: { fontSize: 11, fontWeight: '700', color: colors.primary, marginBottom: 6 },
  postMatchScore: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  postMatchMeta: { fontSize: 12, color: colors.textSecondary },
  postEngagement: { flexDirection: 'row', gap: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  postEngageButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  postEngageIcon: { fontSize: 14 },
  postEngageText: { fontSize: 13, color: colors.textSecondary },
  postsEnd: { alignItems: 'center', paddingVertical: 28 },
  postsEndIcon: { fontSize: 28, marginBottom: 8 },
  postsEndText: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
  postsEndSub: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
});
