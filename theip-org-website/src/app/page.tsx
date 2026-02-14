'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Network, Server, Globe, ChevronUp, Menu, X, Code2, BookOpen, Layers,
  ArrowRight, Terminal, Copy, Check, Shield, Route, Zap, ArrowRightLeft,
  Languages, MapPin, Cloud, Radio, Gauge, Lock, GitBranch, Sun, Moon, ExternalLink
} from 'lucide-react'

// ============================================
// 工具函数：节流函数 ✨ 新增（适配 Cloudflare 环境）
// ============================================
const throttle = (func: Function, delay: number) => {
  // 替换 NodeJS.Timeout 为 number（Cloudflare 环境中 setTimeout 返回数字型 timer ID）
  let timeout: number | null = null
  return (...args: any[]) => {
    if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(null, args)
        timeout = null
      }, delay)
    }
  }
}

// ============================================
// 站点配置 - 预留 CDN URL 位置
// ============================================
const SITE_CONFIG = {
  faviconUrl: '', // TODO: 填入站点图标的 CDN URL
  logoUrl: '',    // TODO: 填入 Logo 图片的 CDN URL
  siteName: 'theip.org',
  version: '1.0.0',
}

// ============================================
// 主题上下文
// ============================================
type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

// ============================================
// 国际化配置
// ============================================
type Language = 'zh' | 'en'

interface I18nContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

const useI18n = () => {
  const context = useContext(I18nContext)
  // 核心修改1：预渲染/无context时不抛错，返回兜底值（避免崩溃）
  if (!context) {
    return {
      lang: 'zh' as Language,
      setLang: () => {}, // 空函数兜底（预渲染无交互，不影响功能）
      t: (key: string) => translations.zh[key] || key // 优化：优先返回中文翻译，无则返回key
    };
  }
  // 核心修改2：给lang加兜底，防止lang为undefined导致后续异常
  const { lang = 'zh', setLang, t } = context;
  return { lang, setLang, t };
}

// 完整的翻译配置
const translations: Record<Language, Record<string, string>> = {
  zh: {
    // 导航 - 完整名称
    'nav.ipv4': 'IPv4（互联网协议第4版）',
    'nav.ipv6': 'IPv6（互联网协议第6版）',
    'nav.comparison': '协议对比',
    'nav.routing': 'IP路由原理',
    'nav.dns': 'IP与DNS',
    'nav.cdn': 'IP与CDN',
    'nav.transport': 'IP与传输层',
    'nav.geoip': 'IP地理定位',
    'nav.multicast': 'IP组播',
    'nav.qos': 'IP服务质量',
    'nav.security': 'IP安全',
    'nav.tunnel': 'IP隧道技术',
    'nav.future': '未来演进',
    
    // 简短导航（移动端）
    'nav.ipv4_short': 'IPv4',
    'nav.ipv6_short': 'IPv6',
    'nav.comparison_short': '对比',
    'nav.routing_short': '路由',
    'nav.dns_short': 'DNS',
    'nav.cdn_short': 'CDN',
    'nav.transport_short': '传输层',
    'nav.geoip_short': '地理定位',
    'nav.multicast_short': '组播',
    'nav.qos_short': 'QoS',
    'nav.security_short': '安全',
    'nav.tunnel_short': '隧道',
    'nav.future_short': '未来',
    
    // Hero
    'hero.badge': '专业IP技术文档',
    'hero.title': 'theip.org',
    'hero.subtitle': '互联网协议权威技术文档',
    'hero.description': '全球最全面的IPv4与IPv6技术参考，面向网络工程师、系统架构师和科研人员。涵盖地址架构、路由协议、安全机制、性能优化及前沿发展趋势。',
    'hero.start': '开始阅读',
    
    // 统计
    'stats.ipv4_bits': 'IPv4位址',
    'stats.ipv6_bits': 'IPv6位址',
    'stats.protocols': '相关协议',
    'stats.rfcs': 'RFC文档',
    
    // 通用
    'common.example': '示例',
    'common.note': '注意',
    'common.tip': '提示',
    'common.warning': '警告',
    'common.definition': '定义',
    'common.history': '历史背景',
    'common.structure': '结构',
    'common.application': '应用场景',
    
    // IPv4 章节标题
    'ipv4.title': 'IPv4（Internet Protocol version 4，互联网协议第4版）',
    'ipv4.subtitle': '网络层核心协议',
    
    'ipv4.overview.title': '概述',
    'ipv4.overview.content': 'IPv4是互联网协议的第四个版本，由IETF于1981年在RFC 791中正式定义。作为TCP/IP协议族的核心，IPv4工作在网络层，负责在不同网络之间进行数据包的路由和转发。IPv4使用32位地址空间，理论上可提供约42.9亿（2³² = 4,294,967,296）个唯一地址。尽管地址资源已接近枯竭，但IPv4仍然是全球互联网基础设施的重要组成部分。',
    
    'ipv4.history.title': '历史背景与发展',
    'ipv4.history.content': 'IPv4由DARPA开发，最初是ARPANET项目的一部分。1983年1月1日，ARPANET正式从NCP协议切换到TCP/IP协议，这一天被称为"互联网诞生日"。IPv4的设计目标是实现异构网络之间的互联互通，其简单可靠的设计为互联网的快速发展奠定了基础。',
    
    'ipv4.address.title': '地址结构与表示',
    'ipv4.address.format': '地址格式',
    'ipv4.address.format_desc': 'IPv4地址使用点分十进制（Dotted Decimal Notation）表示法。32位地址被分为4个8位组（octet），每组用0-255的十进制数表示，组间用点号（.）分隔。',
    'ipv4.address.binary': '二进制表示',
    'ipv4.address.binary_desc': '在计算机内部，IPv4地址以32位二进制数存储。理解二进制表示对于子网划分和网络故障排查至关重要。',
    'ipv4.address.conversion': '进制转换示例',
    'ipv4.address.example': '示例地址',
    'ipv4.address.decimal': '十进制',
    'ipv4.address.bin': '二进制',
    
    'ipv4.classes.title': '地址分类体系',
    'ipv4.classes.intro': 'IPv4地址最初采用有类地址（Classful Addressing）方案，根据地址的前几位将地址分为A、B、C、D、E五类。虽然现在已被CIDR取代，但理解有类地址对于学习网络基础仍然重要。',
    'ipv4.classes.class': '类别',
    'ipv4.classes.range': '地址范围',
    'ipv4.classes.mask': '默认子网掩码',
    'ipv4.classes.networks': '网络数量',
    'ipv4.classes.hosts': '主机数量',
    'ipv4.classes.usage': '用途说明',
    'ipv4.classes.high_bit': '高位特征',
    
    'ipv4.classes.a_title': 'A类地址',
    'ipv4.classes.a_desc': 'A类地址首位为0，网络号占8位，主机号占24位。适用于大型网络，每个网络可容纳约1677万台主机。',
    'ipv4.classes.b_title': 'B类地址',
    'ipv4.classes.b_desc': 'B类地址前两位为10，网络号占16位，主机号占16位。适用于中型网络，每个网络可容纳65534台主机。',
    'ipv4.classes.c_title': 'C类地址',
    'ipv4.classes.c_desc': 'C类地址前三位为110，网络号占24位，主机号占8位。适用于小型网络，每个网络可容纳254台主机。',
    'ipv4.classes.d_title': 'D类地址（组播）',
    'ipv4.classes.d_desc': 'D类地址前四位为1110，用于IP组播通信，不分配给具体主机。',
    'ipv4.classes.e_title': 'E类地址（保留）',
    'ipv4.classes.e_desc': 'E类地址前四位为1111，保留供研究实验使用。',
    
    'ipv4.subnet.title': '子网划分技术',
    'ipv4.subnet.mask_title': '子网掩码（Subnet Mask）',
    'ipv4.subnet.mask_desc': '子网掩码是一个32位的二进制数，用于区分IP地址中的网络部分和主机部分。掩码中的网络位全为1，主机位全为0。子网掩码也可以用CIDR表示法表示，如255.255.255.0等同于/24。',
    'ipv4.subnet.cidr_title': 'CIDR（无类别域间路由）',
    'ipv4.subnet.cidr_desc': 'CIDR于1993年引入（RFC 1519），取代了有类地址系统。CIDR使用"网络地址/前缀长度"的格式表示，前缀长度表示网络位的数量。这种方式允许更灵活的地址分配，有效缓解了IPv4地址浪费问题。',
    'ipv4.subnet.vlsm_title': 'VLSM（可变长子网掩码）',
    'ipv4.subnet.vlsm_desc': 'VLSM允许在同一网络中使用不同长度的子网掩码，实现精确的地址分配。例如，点对点链路可以使用/30掩码（仅2个可用地址），而用户网段使用/24掩码（254个可用地址）。VLSM是现代网络设计的基础技术。',
    'ipv4.subnet.calc': '子网计算',
    'ipv4.subnet.network': '网络地址',
    'ipv4.subnet.broadcast': '广播地址',
    'ipv4.subnet.first_host': '第一个主机',
    'ipv4.subnet.last_host': '最后一个主机',
    'ipv4.subnet.total_hosts': '可用主机数',
    
    'ipv4.public_private.title': '公网IP与内网IP',
    'ipv4.public_private.intro': 'IP地址分为公网地址和私有地址两大类，这是理解现代网络架构的关键概念。',
    'ipv4.public.title': '公网IP地址（Public IP Address）',
    'ipv4.public.desc': '公网IP地址是由互联网号码分配机构（IANA）及其下属的区域互联网注册管理机构（RIR）统一分配的全球唯一地址。公网IP地址可以直接在互联网上进行路由，是互联网通信的基础。',
    'ipv4.public.features': '公网IP特点',
    'ipv4.public.feature1': '全球唯一性：每个公网IP地址在全球范围内唯一',
    'ipv4.public.feature2': '可路由性：可以在互联网上直接路由',
    'ipv4.public.feature3': '需申请分配：由ISP或RIR分配',
    'ipv4.public.feature4': '资源稀缺：IPv4地址已分配完毕',
    'ipv4.public.types': '公网IP类型',
    'ipv4.public.type1': '静态公网IP：固定分配给特定设备，常用于服务器',
    'ipv4.public.type2': '动态公网IP：临时分配，常用于家庭宽带用户',
    
    'ipv4.private.title': '私有IP地址（Private IP Address）',
    'ipv4.private.desc': '私有IP地址是RFC 1918定义的保留地址，用于内部网络，不在公网上路由。私有地址可以重复使用，不同组织的内部网络可以使用相同的私有地址。',
    'ipv4.private.ranges': '私有地址范围',
    'ipv4.private.range_a': 'A类私有地址：10.0.0.0/8（10.0.0.0 - 10.255.255.255）',
    'ipv4.private.range_b': 'B类私有地址：172.16.0.0/12（172.16.0.0 - 172.31.255.255）',
    'ipv4.private.range_c': 'C类私有地址：192.168.0.0/16（192.168.0.0 - 192.168.255.255）',
    'ipv4.private.features': '私有IP特点',
    'ipv4.private.feature1': '地址复用：不同组织可使用相同私有地址',
    'ipv4.private.feature2': '不可公网路由：在公网路由器上被过滤',
    'ipv4.private.feature3': '免费使用：无需向IANA申请',
    'ipv4.private.feature4': '需要NAT：访问互联网需要网络地址转换',
    
    'ipv4.nat.title': 'NAT（Network Address Translation，网络地址转换）',
    'ipv4.nat.intro': 'NAT是实现公网IP与私有IP互通的关键技术，解决了IPv4地址短缺问题。',
    'ipv4.nat.snat': 'SNAT（源地址转换）',
    'ipv4.nat.snat_desc': '修改数据包的源IP地址，用于内部网络访问互联网。这是最常见的NAT类型。',
    'ipv4.nat.dnat': 'DNAT（目的地址转换）',
    'ipv4.nat.dnat_desc': '修改数据包的目的IP地址，用于端口转发和负载均衡。',
    'ipv4.nat.pat': 'PAT（端口地址转换）',
    'ipv4.nat.pat_desc': '使用端口号区分不同的连接，允许多个内部主机共享一个公网IP。也称为NAPT或IP伪装。',
    'ipv4.nat.process': 'NAT工作流程',
    'ipv4.nat.step1': '1. 内部主机发送数据包，源地址为私有IP',
    'ipv4.nat.step2': '2. NAT网关替换源地址为公网IP，记录映射关系',
    'ipv4.nat.step3': '3. 数据包在互联网上传输',
    'ipv4.nat.step4': '4. 响应数据包到达NAT网关',
    'ipv4.nat.step5': '5. NAT网关根据映射表将目的地址替换回私有IP',
    'ipv4.nat.step6': '6. 数据包转发给内部主机',
    
    'ipv4.special.title': '特殊用途地址',
    'ipv4.special.loopback': '回环地址（Loopback）',
    'ipv4.special.loopback_desc': '127.0.0.0/8整个网段保留用于本地回环测试。最常用的是127.0.0.1（localhost），发送到此地址的数据包不会离开主机，直接返回给协议栈。',
    'ipv4.special.linklocal': '链路本地地址（Link-Local）',
    'ipv4.special.linklocal_desc': '169.254.0.0/16用于自动配置。当主机无法通过DHCP获取地址时，会自动从此范围选择一个地址使用。',
    'ipv4.special.broadcast': '广播地址',
    'ipv4.special.broadcast_desc': '广播地址用于向网络中所有主机发送数据包。有限广播地址255.255.255.255在本地网络广播；定向广播地址是网络地址的主机位全置1。',
    'ipv4.special.zero': '全零地址',
    'ipv4.special.zero_desc': '0.0.0.0/8表示"本网络"，常用于默认路由或表示任意地址。',
    
    'ipv4.header.title': 'IPv4报文头部结构',
    'ipv4.header.intro': 'IPv4头部由20字节的固定部分和最多40字节的选项部分组成。理解头部结构对于网络编程、故障排查和协议分析至关重要。',
    'ipv4.header.field': '字段名',
    'ipv4.header.bits': '位数',
    'ipv4.header.offset': '偏移',
    'ipv4.header.desc': '描述',
    'ipv4.header.version': 'Version（版本）',
    'ipv4.header.version_desc': '4位，IP协议版本号，IPv4为4',
    'ipv4.header.ihl': 'IHL（头部长度）',
    'ipv4.header.ihl_desc': '4位，以32位字为单位的头部长度，最小5（20字节），最大15（60字节）',
    'ipv4.header.tos': 'ToS（服务类型）',
    'ipv4.header.tos_desc': '8位，现被DSCP和ECN使用，用于QoS',
    'ipv4.header.length': 'Total Length（总长度）',
    'ipv4.header.length_desc': '16位，整个IP数据包的字节数，最大65535字节',
    'ipv4.header.id': 'Identification（标识）',
    'ipv4.header.id_desc': '16位，用于分片重组，同一数据包的所有分片标识相同',
    'ipv4.header.flags': 'Flags（标志）',
    'ipv4.header.flags_desc': '3位，包括保留位、DF（不分片）、MF（更多分片）',
    'ipv4.header.offset_field': 'Fragment Offset（片偏移）',
    'ipv4.header.offset_desc': '13位，分片在原数据包中的偏移位置，以8字节为单位',
    'ipv4.header.ttl': 'TTL（生存时间）',
    'ipv4.header.ttl_desc': '8位，数据包可经过的最大路由器数量，每跳减1',
    'ipv4.header.protocol': 'Protocol（协议）',
    'ipv4.header.protocol_desc': '8位，上层协议号，如TCP=6、UDP=17、ICMP=1',
    'ipv4.header.checksum': 'Header Checksum（头部校验和）',
    'ipv4.header.checksum_desc': '16位，IPv4头部的校验和，用于错误检测',
    'ipv4.header.src': 'Source Address（源地址）',
    'ipv4.header.src_desc': '32位，发送方的IPv4地址',
    'ipv4.header.dst': 'Destination Address（目的地址）',
    'ipv4.header.dst_desc': '32位，接收方的IPv4地址',
    'ipv4.header.options': 'Options（选项）',
    'ipv4.header.options_desc': '可变长度，可选的扩展功能，实践中很少使用',
    
    'ipv4.fragmentation.title': 'IP分片与重组',
    'ipv4.fragmentation.intro': '当IP数据包大小超过链路的MTU（Maximum Transmission Unit）时，需要进行分片。分片由路由器执行，重组仅在目的主机进行。',
    'ipv4.fragmentation.mtu': 'MTU值',
    'ipv4.fragmentation.mtu_ethernet': '以太网：1500字节',
    'ipv4.fragmentation.mtu_pppoe': 'PPPoE：1492字节',
    'ipv4.fragmentation.mtu_tunnel': '隧道接口：通常更小',
    'ipv4.fragmentation.mtu_loopback': '回环接口：通常65535字节',
    'ipv4.fragmentation.pmtud': '路径MTU发现（PMTUD）',
    'ipv4.fragmentation.pmtud_desc': 'PMTUD使用ICMP不可达消息动态发现路径上的最小MTU，避免分片。当DF标志置1时，路由器会返回ICMP消息告知需要分片。',
    
    'ipv4.ttl.title': 'TTL（Time To Live，生存时间）',
    'ipv4.ttl.intro': 'TTL是IPv4头部的一个8位字段，用于防止数据包在网络中无限循环。TTL初始值由发送方设置（通常为64或128），每经过一个路由器减1。当TTL为0时，路由器丢弃数据包并返回ICMP超时消息。',
    'ipv4.ttl.default': '常见默认值',
    'ipv4.ttl.linux': 'Linux：64',
    'ipv4.ttl.windows': 'Windows：128',
    'ipv4.ttl.cisco': 'Cisco设备：255',
    'ipv4.ttl.traceroute': 'Traceroute原理',
    'ipv4.ttl.traceroute_desc': 'Traceroute利用TTL机制追踪路由路径。它发送TTL递增的数据包，根据返回的ICMP超时消息确定路径上每个路由器的IP地址。',
    
    'ipv4.arp.title': 'ARP（Address Resolution Protocol，地址解析协议）',
    'ipv4.arp.intro': 'ARP协议将IP地址解析为MAC地址，是以太网等局域网通信的基础。',
    'ipv4.arp.process': 'ARP工作流程',
    'ipv4.arp.step1': '1. 主机检查ARP缓存是否有目标IP的MAC地址',
    'ipv4.arp.step2': '2. 若无，广播ARP请求："谁有IP X？请告诉MAC Y"',
    'ipv4.arp.step3': '3. 目标主机单播回复ARP响应："我是IP X，我的MAC是Z"',
    'ipv4.arp.step4': '4. 发送方缓存IP-MAC映射，有效期通常几分钟',
    'ipv4.arp.cache': 'ARP缓存管理',
    'ipv4.arp.cache_desc': 'ARP缓存存储IP到MAC的映射，有老化机制自动删除过期条目。可以通过命令查看和管理ARP缓存。',
    'ipv4.arp.gratuitous': '免费ARP（Gratuitous ARP）',
    'ipv4.arp.gratuitous_desc': '主机发送ARP请求询问自己的IP地址，用于检测IP地址冲突和通告MAC地址变更。',
    'ipv4.arp.proxy': '代理ARP（Proxy ARP）',
    'ipv4.arp.proxy_desc': '路由器代替目标主机响应ARP请求，用于实现跨网段的透明访问。',
    
    'ipv4.dhcp.title': 'DHCP（Dynamic Host Configuration Protocol，动态主机配置协议）',
    'ipv4.dhcp.intro': 'DHCP协议自动为主机分配IP地址和其他网络配置，简化了网络管理。',
    'ipv4.dhcp.process': 'DHCP工作流程（DORA）',
    'ipv4.dhcp.discover': '1. DHCP Discover：客户端广播发现DHCP服务器',
    'ipv4.dhcp.offer': '2. DHCP Offer：服务器单播/广播提供IP地址',
    'ipv4.dhcp.request': '3. DHCP Request：客户端广播请求使用该地址',
    'ipv4.dhcp.ack': '4. DHCP Ack：服务器确认并提供完整配置',
    'ipv4.dhcp.options': 'DHCP选项',
    'ipv4.dhcp.option_subnet': '子网掩码',
    'ipv4.dhcp.option_router': '默认网关',
    'ipv4.dhcp.option_dns': 'DNS服务器',
    'ipv4.dhcp.option_lease': '租约时间',
    'ipv4.dhcp.relay': 'DHCP中继',
    'ipv4.dhcp.relay_desc': 'DHCP中继代理允许DHCP请求跨网段传输，使一个DHCP服务器可以服务多个网段。',
    
    'ipv4.icmp.title': 'ICMP（Internet Control Message Protocol，互联网控制消息协议）',
    'ipv4.icmp.intro': 'ICMP用于传递错误消息和操作信息，是Ping、Traceroute等网络诊断工具的基础。',
    'ipv4.icmp.type': '类型',
    'ipv4.icmp.code': '代码',
    'ipv4.icmp.name': '名称',
    'ipv4.icmp.meaning': '含义',
    'ipv4.icmp.echo_reply': 'Echo Reply（回显应答）',
    'ipv4.icmp.echo_request': 'Echo Request（回显请求）',
    'ipv4.icmp.dest_unreach': 'Destination Unreachable（目的不可达）',
    'ipv4.icmp.time_exceeded': 'Time Exceeded（超时）',
    'ipv4.icmp.redirect': 'Redirect（重定向）',
    'ipv4.icmp.source_quench': 'Source Quench（源抑制，已废弃）',
    'ipv4.icmp.ping': 'Ping工具',
    'ipv4.icmp.ping_desc': 'Ping使用ICMP Echo Request和Echo Reply测试网络连通性，测量往返时间（RTT）。',
    
    'ipv4.igmp.title': 'IGMP（Internet Group Management Protocol，互联网组管理协议）',
    'ipv4.igmp.intro': 'IGMP用于管理IP组播组的成员关系，主机通过IGMP加入或离开组播组。',
    'ipv4.igmp.version': 'IGMP版本',
    'ipv4.igmp.v1': 'IGMPv1：支持加入组，离开需要超时',
    'ipv4.igmp.v2': 'IGMPv2：增加离开组消息，支持组播路由器选举',
    'ipv4.igmp.v3': 'IGMPv3：支持源特定组播（SSM）',
    
    'ipv4.code.title': '代码示例',
    'ipv4.code.subtitle': '多语言IPv4地址处理',
    
    // IPv6 章节
    'ipv6.title': 'IPv6（Internet Protocol version 6，互联网协议第6版）',
    'ipv6.subtitle': '下一代互联网协议',
    
    'ipv6.overview.title': '概述',
    'ipv6.overview.content': 'IPv6是下一代互联网协议，由IETF于1998年在RFC 2460中正式标准化。IPv6使用128位地址空间，可提供约3.4×10³⁸（340涧）个地址，从根本上解决了IPv4地址枯竭问题。IPv6不仅在地址空间上实现了质的飞跃，还在安全性、移动性、配置简化等方面进行了重大改进。',
    
    'ipv6.history.title': '历史背景与开发动机',
    'ipv6.history.content': '1990年代初，IETF预见到IPv4地址耗尽的危机，启动了IPng（下一代IP）项目。经过评估多个提案，最终选择了由Steve Deering和Robert Hinden提出的SIPP（Simple Internet Protocol Plus）方案，发展为今天的IPv6。',
    
    'ipv6.address.title': '地址结构与表示',
    'ipv6.address.format': '地址格式',
    'ipv6.address.format_desc': 'IPv6地址使用冒号十六进制（Colon Hexadecimal）表示法，将128位地址分为8组16位字段，每组用4个十六进制数表示，组间用冒号（:）分隔。',
    'ipv6.address.compression': '地址压缩规则',
    'ipv6.address.rule1': '规则1：前导零省略',
    'ipv6.address.rule1_desc': '每组中前导的零可以省略，如2001:0db8可简写为2001:db8',
    'ipv6.address.rule2': '规则2：连续零压缩',
    'ipv6.address.rule2_desc': '连续的全零组可以用::代替，但每个地址只能使用一次',
    'ipv6.address.example': '地址示例',
    'ipv6.address.full': '完整形式',
    'ipv6.address.compressed': '压缩形式',
    
    'ipv6.types.title': '地址类型',
    'ipv6.types.intro': 'IPv6地址分为单播、任播和组播三种类型，取消了IPv4中的广播地址。',
    'ipv6.types.unicast': '单播地址（Unicast）',
    'ipv6.types.unicast_desc': '一对一通信，标识单个网络接口。',
    'ipv6.types.global_unicast': '全球单播地址',
    'ipv6.types.global_unicast_desc': '2000::/3，相当于IPv4的公网地址，全球唯一可路由。',
    'ipv6.types.link_local': '链路本地地址',
    'ipv6.types.link_local_desc': 'fe80::/10，仅在本链路有效，路由器不转发。',
    'ipv6.types.unique_local': '唯一本地地址',
    'ipv6.types.unique_local_desc': 'fc00::/7，相当于IPv4的私有地址，用于内部网络。',
    'ipv6.types.anycast': '任播地址（Anycast）',
    'ipv6.types.anycast_desc': '一对最近通信，标识一组接口，数据包发送到最近的一个。用于DNS根服务器、CDN等场景。',
    'ipv6.types.multicast': '组播地址（Multicast）',
    'ipv6.types.multicast_desc': '一对多通信，ff00::/8，标识一组接口，数据包发送到所有成员。',
    
    'ipv6.header.title': 'IPv6报文头部结构',
    'ipv6.header.intro': 'IPv6头部固定为40字节，相比IPv4大幅简化，提高了路由器处理效率。',
    'ipv6.header.field': '字段名',
    'ipv6.header.bits': '位数',
    'ipv6.header.desc': '描述',
    'ipv6.header.version': 'Version（版本）',
    'ipv6.header.version_desc': '4位，IP协议版本号，IPv6为6',
    'ipv6.header.traffic': 'Traffic Class（流量类别）',
    'ipv6.header.traffic_desc': '8位，类似IPv4的ToS，用于QoS',
    'ipv6.header.flow': 'Flow Label（流标签）',
    'ipv6.header.flow_desc': '20位，标识同一流的数据包，便于QoS处理',
    'ipv6.header.payload': 'Payload Length（有效载荷长度）',
    'ipv6.header.payload_desc': '16位，除头部外的数据长度',
    'ipv6.header.next': 'Next Header（下一头部）',
    'ipv6.header.next_desc': '8位，标识下一个头部类型（扩展头部或上层协议）',
    'ipv6.header.hop': 'Hop Limit（跳数限制）',
    'ipv6.header.hop_desc': '8位，类似IPv4的TTL',
    'ipv6.header.src': 'Source Address（源地址）',
    'ipv6.header.src_desc': '128位，发送方的IPv6地址',
    'ipv6.header.dst': 'Destination Address（目的地址）',
    'ipv6.header.dst_desc': '128位，接收方的IPv6地址',
    
    'ipv6.extension.title': '扩展头部',
    'ipv6.extension.intro': 'IPv6使用扩展头部链实现可选功能，避免了IPv4选项字段的性能问题。扩展头部位于固定头部和上层协议数据之间。',
    'ipv6.extension.type': '类型值',
    'ipv6.extension.name': '扩展头部',
    'ipv6.extension.desc': '描述',
    'ipv6.extension.hop': '逐跳选项（Hop-by-Hop）',
    'ipv6.extension.hop_desc': '每个路由器都要处理的选项',
    'ipv6.extension.routing': '路由（Routing）',
    'ipv6.extension.routing_desc': '源路由选项',
    'ipv6.extension.fragment': '分片（Fragment）',
    'ipv6.extension.fragment_desc': '分片信息',
    'ipv6.extension.esp': 'ESP（封装安全载荷）',
    'ipv6.extension.esp_desc': 'IPsec加密',
    'ipv6.extension.ah': 'AH（认证头）',
    'ipv6.extension.ah_desc': 'IPsec认证',
    'ipv6.extension.dest': '目的选项（Destination）',
    'ipv6.extension.dest_desc': '目的节点处理的选项',
    
    'ipv6.slaac.title': 'SLAAC（Stateless Address Autoconfiguration，无状态地址自动配置）',
    'ipv6.slaac.intro': 'IPv6支持SLAAC，主机可以自动生成全球唯一的地址，无需DHCP服务器。这是IPv6相比IPv4的重大改进。',
    'ipv6.slaac.process': 'SLAAC工作流程',
    'ipv6.slaac.step1': '1. 主机生成链路本地地址（fe80::）',
    'ipv6.slaac.step2': '2. 发送路由器请求（RS）',
    'ipv6.slaac.step3': '3. 路由器响应路由器通告（RA），包含网络前缀',
    'ipv6.slaac.step4': '4. 主机使用前缀+接口标识符生成全球地址',
    'ipv6.slaac.step5': '5. 执行重复地址检测（DAD）确保唯一性',
    'ipv6.slaac.eui64': 'EUI-64接口标识符',
    'ipv6.slaac.eui64_desc': 'EUI-64是将48位MAC地址扩展为64位接口ID的方法。在MAC地址中间插入FFFE，并将第7位取反。',
    
    'ipv6.ndp.title': 'NDP（Neighbor Discovery Protocol，邻居发现协议）',
    'ipv6.ndp.intro': 'NDP使用ICMPv6消息，实现了地址解析、路由器发现、前缀发现、邻居不可达检测等功能，取代了IPv4中的ARP。',
    'ipv6.ndp.type': '消息类型',
    'ipv6.ndp.name': '名称',
    'ipv6.ndp.function': '功能',
    'ipv6.ndp.rs': 'Router Solicitation（路由器请求）',
    'ipv6.ndp.rs_desc': '主机请求路由器发送RA',
    'ipv6.ndp.ra': 'Router Advertisement（路由器通告）',
    'ipv6.ndp.ra_desc': '路由器通告网络信息',
    'ipv6.ndp.ns': 'Neighbor Solicitation（邻居请求）',
    'ipv6.ndp.ns_desc': '地址解析和DAD',
    'ipv6.ndp.na': 'Neighbor Advertisement（邻居通告）',
    'ipv6.ndp.na_desc': '响应NS，提供MAC地址',
    'ipv6.ndp.redirect': 'Redirect（重定向）',
    'ipv6.ndp.redirect_desc': '通知更好的下一跳',
    
    'ipv6.transition.title': '过渡技术',
    'ipv6.transition.intro': '由于IPv4和IPv6不兼容，需要过渡技术实现平滑迁移。',
    'ipv6.transition.dual': '双栈（Dual Stack）',
    'ipv6.transition.dual_desc': '设备同时运行IPv4和IPv6协议栈，是最简单直接的过渡方案。两种协议独立运行，应用选择使用哪个。',
    'ipv6.transition.tunnel': '隧道（Tunneling）',
    'ipv6.transition.tunnel_desc': '将IPv6数据包封装在IPv4中传输。常用技术包括6to4、Teredo、ISATAP等。',
    'ipv6.transition.nat64': 'NAT64/DNS64',
    'ipv6.transition.nat64_desc': '在IPv6网络中访问IPv4资源。DNS64合成AAAA记录，NAT64进行地址转换。',
    
    'ipv6.mobile.title': '移动IPv6（Mobile IPv6）',
    'ipv6.mobile.intro': 'Mobile IPv6提供原生移动性支持，允许设备在不中断连接的情况下改变网络接入点。',
    'ipv6.mobile.concept': '核心概念',
    'ipv6.mobile.hoa': '家乡地址（Home Address）：设备的永久地址',
    'ipv6.mobile.coa': '转交地址（Care-of Address）：设备在外地网络获得的临时地址',
    'ipv6.mobile.ha': '家乡代理（Home Agent）：家乡网络上的路由器',
    
    'ipv6.mld.title': 'MLD（Multicast Listener Discovery，组播监听发现）',
    'ipv6.mld.intro': 'MLD是IPv6的组播组成员管理协议，相当于IPv4中的IGMP。',
    'ipv6.mld.version': 'MLD版本',
    'ipv6.mld.v1': 'MLDv1：相当于IGMPv2',
    'ipv6.mld.v2': 'MLDv2：相当于IGMPv3，支持源特定组播',
    
    'ipv6.code.title': '代码示例',
    'ipv6.code.subtitle': '多语言IPv6地址处理',
    
    // 对比
    'comparison.title': 'IPv4与IPv6全面对比',
    'comparison.subtitle': '协议特性与能力差异',
    'comparison.feature': '特性',
    'comparison.ipv4': 'IPv4',
    'comparison.ipv6': 'IPv6',
    
    // 路由
    'routing.title': 'IP路由原理',
    'routing.subtitle': '路由决策与协议',
    'routing.table.title': '路由表',
    'routing.table.intro': '路由表是路由决策的核心数据结构，存储目的网络与下一跳的映射关系。',
    'routing.match.title': '最长前缀匹配',
    'routing.match.intro': '路由选择遵循最长前缀匹配（Longest Prefix Match）原则，当多个路由条目匹配目的地址时，选择掩码最长的条目。',
    'routing.static.title': '静态路由',
    'routing.static.intro': '静态路由由管理员手动配置，适用于简单网络或特定需求。',
    'routing.dynamic.title': '动态路由协议',
    'routing.ospf': 'OSPF（开放最短路径优先）：链路状态协议，适用于企业内部',
    'routing.bgp': 'BGP（边界网关协议）：路径向量协议，互联网核心路由协议',
    'routing.rip': 'RIP（路由信息协议）：距离向量协议，小型网络',
    'routing.isis': 'IS-IS（中间系统到中间系统）：链路状态协议，运营商网络',
    
    // DNS
    'dns.title': 'IP与DNS（Domain Name System，域名系统）',
    'dns.subtitle': '域名解析与IP地址映射',
    'dns.intro': 'DNS将人类易记的域名转换为机器使用的IP地址，是互联网的基础服务。',
    'dns.records.title': 'DNS记录类型',
    'dns.records.type': '类型',
    'dns.records.name': '名称',
    'dns.records.desc': '描述',
    'dns.records.a': 'A记录',
    'dns.records.a_desc': '域名到IPv4地址的映射',
    'dns.records.aaaa': 'AAAA记录',
    'dns.records.aaaa_desc': '域名到IPv6地址的映射',
    'dns.records.ptr': 'PTR记录',
    'dns.records.ptr_desc': '反向解析，IP地址到域名',
    'dns.records.ns': 'NS记录',
    'dns.records.ns_desc': '指定域名的权威名称服务器',
    'dns.records.mx': 'MX记录',
    'dns.records.mx_desc': '邮件交换服务器',
    'dns.records.cname': 'CNAME记录',
    'dns.records.cname_desc': '域名别名',
    'dns.records.txt': 'TXT记录',
    'dns.records.txt_desc': '文本记录，用于SPF、DKIM等',
    'dns.records.srv': 'SRV记录',
    'dns.records.srv_desc': '服务定位记录',
    'dns.process.title': 'DNS解析过程',
    'dns.recursive': '递归查询',
    'dns.iterative': '迭代查询',
    'dns.cache': 'DNS缓存',
    'dns.dnssec': 'DNSSEC安全扩展',
    
    // CDN
    'cdn.title': 'IP与CDN（Content Delivery Network，内容分发网络）',
    'cdn.subtitle': '内容加速与IP调度',
    'cdn.intro': 'CDN通过在全球部署边缘节点，将内容缓存到离用户最近的位置，提高访问速度。',
    'cdn.principle.title': 'CDN工作原理',
    'cdn.anycast.title': 'Anycast技术',
    'cdn.anycast.intro': 'Anycast允许多个服务器使用相同的IP地址，用户自动路由到最近的节点。',
    'cdn.edge': '边缘节点',
    'cdn.cache': '缓存策略',
    'cdn.load_balance': '负载均衡',
    'cdn.geo_dns': 'GeoDNS地理DNS',
    
    // 传输层
    'transport.title': 'IP与传输层',
    'transport.subtitle': 'TCP/IP协议栈',
    'transport.intro': '传输层位于网络层之上，提供端到端的数据传输服务。',
    'transport.tcp.title': 'TCP（Transmission Control Protocol，传输控制协议）',
    'transport.tcp.intro': 'TCP是面向连接的可靠传输协议，提供流量控制、拥塞控制和错误恢复。',
    'transport.tcp.features': 'TCP特性',
    'transport.tcp.connection': '面向连接：三次握手建立连接',
    'transport.tcp.reliable': '可靠传输：确认重传机制',
    'transport.tcp.flow': '流量控制：滑动窗口',
    'transport.tcp.congestion': '拥塞控制：慢启动、拥塞避免',
    'transport.udp.title': 'UDP（User Datagram Protocol，用户数据报协议）',
    'transport.udp.intro': 'UDP是无连接的不可靠传输协议，提供高效的数据传输。',
    'transport.udp.features': 'UDP特性',
    'transport.udp.connectionless': '无连接：无需建立连接',
    'transport.udp.fast': '高效：无确认开销',
    'transport.udp.unreliable': '不可靠：不保证送达',
    'transport.port.title': '端口号',
    'transport.port.intro': '端口号用于标识主机上的应用程序，范围从0到65535。',
    'transport.port.wellknown': '知名端口（0-1023）',
    'transport.port.registered': '注册端口（1024-49151）',
    'transport.port.dynamic': '动态端口（49152-65535）',
    
    // GeoIP
    'geoip.title': 'IP地理定位（GeoIP）',
    'geoip.subtitle': '通过IP地址确定地理位置',
    'geoip.intro': 'IP地理定位通过IP地址确定地理位置信息，广泛应用于内容本地化、安全防护等领域。',
    'geoip.principle.title': 'GeoIP原理',
    'geoip.principle.intro': 'GeoIP基于WHOIS数据、BGP路由信息、用户贡献数据等来确定IP地址的地理位置。',
    'geoip.database.title': 'GeoIP数据库',
    'geoip.accuracy.title': '定位精度',
    'geoip.accuracy.country': '国家级别：95-99%',
    'geoip.accuracy.city': '城市级别：50-80%',
    'geoip.privacy': '隐私问题',
    
    // 组播
    'multicast.title': 'IP组播（Multicast）',
    'multicast.subtitle': '一对多高效通信',
    'multicast.intro': 'IP组播实现一对多的高效数据传输，广泛用于视频会议、直播等场景。',
    'multicast.address.title': '组播地址',
    'multicast.address.intro': 'IPv4组播地址范围：224.0.0.0 - 239.255.255.255（D类地址）',
    'multicast.igmp.title': 'IGMP协议',
    'multicast.routing.title': '组播路由',
    'multicast.pim': 'PIM协议',
    
    // QoS
    'qos.title': 'IP服务质量（QoS，Quality of Service）',
    'qos.subtitle': '流量优先级与服务保障',
    'qos.intro': 'QoS机制确保关键应用获得所需的网络资源，提供差异化的服务质量。',
    'qos.dscp.title': 'DSCP（Differentiated Services Code Point，差分服务代码点）',
    'qos.dscp.intro': 'DSCP使用IP头部的ToS/Traffic Class字段标记数据包优先级。',
    'qos.traffic_shaping': '流量整形',
    'qos.congestion': '拥塞控制',
    'qos.priority': '优先级队列',
    
    // 安全
    'security.title': 'IP安全',
    'security.subtitle': '网络安全机制',
    'security.intro': 'IP安全涵盖加密、认证、访问控制等多个方面，是网络安全的基础。',
    'security.ipsec.title': 'IPsec（IP Security，IP安全）',
    'security.ipsec.intro': 'IPsec在网络层提供安全服务，是VPN的核心协议。',
    'security.ah': 'AH（Authentication Header，认证头）',
    'security.ah_desc': '提供数据完整性和身份认证，不提供加密',
    'security.esp': 'ESP（Encapsulating Security Payload，封装安全载荷）',
    'security.esp_desc': '提供加密、完整性和认证',
    'security.ike': 'IKE（Internet Key Exchange，互联网密钥交换）',
    'security.ike_desc': '自动协商安全关联和密钥',
    'security.vpn.title': 'VPN（Virtual Private Network，虚拟专用网络）',
    'security.vpn.intro': 'VPN在公网上建立安全的私有通道，常见类型包括IPsec VPN、SSL VPN、WireGuard。',
    'security.firewall': '防火墙',
    'security.ids': '入侵检测系统',
    'security.ddos': 'DDoS防护',
    'security.spoofing': 'IP欺骗防护',
    
    // 隧道
    'tunnel.title': 'IP隧道技术',
    'tunnel.subtitle': '网络互连与协议过渡',
    'tunnel.intro': 'IP隧道技术将一种协议封装在另一种协议中传输，用于网络互连和协议过渡。',
    'tunnel.gre.title': 'GRE（Generic Routing Encapsulation，通用路由封装）',
    'tunnel.gre_desc': '通用的隧道协议，可以封装多种网络层协议',
    'tunnel.ipsec.title': 'IPsec隧道',
    'tunnel.ipsec_desc': '加密的隧道模式，提供数据安全',
    'tunnel.6to4.title': '6to4',
    'tunnel.6to4_desc': 'IPv6 over IPv4自动隧道',
    'tunnel.teredo.title': 'Teredo',
    'tunnel.teredo_desc': 'IPv6 through NAT，使用UDP封装',
    'tunnel.isatap.title': 'ISATAP',
    'tunnel.isatap_desc': '站内IPv6隧道',
    'tunnel.wireguard.title': 'WireGuard',
    'tunnel.wireguard_desc': '现代、快速、安全的VPN协议',
    
    // 未来
    'future.title': 'IP未来演进',
    'future.subtitle': '技术发展趋势',
    'future.intro': 'IP协议随着互联网的发展不断演进，新技术和新应用推动着协议的改进和创新。',
    'future.iot.title': '物联网（IoT，Internet of Things）',
    'future.iot.intro': '预计到2030年，全球将有超过500亿台物联网设备联网。IPv6的海量地址空间是支撑物联网发展的关键基础设施。',
    'future.5g.title': '5G与IPv6',
    'future.5g.intro': '5G网络原生支持IPv6，实现更低的延迟和更高的连接密度。IPv6是5G网络的基础协议。',
    'future.sdn.title': 'SDN/NFV',
    'future.sdn.intro': '软件定义网络（SDN）和网络功能虚拟化（NFV）正在重塑网络架构，IP协议继续作为核心转发机制。',
    'future.edge.title': '边缘计算',
    'future.edge.intro': '边缘计算将计算能力下沉到网络边缘，减少延迟。IPv6支持海量边缘设备的直接寻址。',
    'future.sr.title': 'Segment Routing',
    'future.sr.intro': 'Segment Routing（段路由）是一种新型的源路由架构，简化了MPLS和流量工程，正在成为下一代网络的核心技术。',
    
    // 代码
    'code.copy': '复制',
    'code.copied': '已复制',
    
    // 页脚
    'footer.docs': 'IP技术文档',
    'footer.built': '基于 Next.js 构建',
    'footer.rights': '版权所有',
  },
  en: {
    // Navigation - Full names
    'nav.ipv4': 'IPv4 (Internet Protocol version 4)',
    'nav.ipv6': 'IPv6 (Internet Protocol version 6)',
    'nav.comparison': 'Protocol Comparison',
    'nav.routing': 'IP Routing Principles',
    'nav.dns': 'IP and DNS',
    'nav.cdn': 'IP and CDN',
    'nav.transport': 'IP and Transport Layer',
    'nav.geoip': 'IP Geolocation',
    'nav.multicast': 'IP Multicast',
    'nav.qos': 'IP QoS',
    'nav.security': 'IP Security',
    'nav.tunnel': 'IP Tunneling',
    'nav.future': 'Future Evolution',
    
    // Short navigation (mobile)
    'nav.ipv4_short': 'IPv4',
    'nav.ipv6_short': 'IPv6',
    'nav.comparison_short': 'Compare',
    'nav.routing_short': 'Routing',
    'nav.dns_short': 'DNS',
    'nav.cdn_short': 'CDN',
    'nav.transport_short': 'Transport',
    'nav.geoip_short': 'GeoIP',
    'nav.multicast_short': 'Multicast',
    'nav.qos_short': 'QoS',
    'nav.security_short': 'Security',
    'nav.tunnel_short': 'Tunnel',
    'nav.future_short': 'Future',
    
    // Hero
    'hero.badge': 'Professional IP Technical Documentation',
    'hero.title': 'theip.org',
    'hero.subtitle': 'Internet Protocol Authoritative Documentation',
    'hero.description': 'The world\'s most comprehensive IPv4 and IPv6 technical reference for network engineers, system architects, and researchers.',
    'hero.start': 'Get Started',
    
    // Stats
    'stats.ipv4_bits': 'IPv4 Bits',
    'stats.ipv6_bits': 'IPv6 Bits',
    'stats.protocols': 'Protocols',
    'stats.rfcs': 'RFC Docs',
    
    // Common
    'common.example': 'Example',
    'common.note': 'Note',
    'common.tip': 'Tip',
    'common.warning': 'Warning',
    'common.definition': 'Definition',
    'common.history': 'History',
    'common.structure': 'Structure',
    'common.application': 'Applications',
    
    // IPv4
    'ipv4.title': 'IPv4 (Internet Protocol version 4)',
    'ipv4.subtitle': 'Core Network Layer Protocol',
    
    'ipv4.overview.title': 'Overview',
    'ipv4.overview.content': 'IPv4 is the fourth version of the Internet Protocol, defined in RFC 791 by IETF in 1981. As the core of the TCP/IP protocol suite, IPv4 operates at the network layer, responsible for routing and forwarding packets between different networks. IPv4 uses 32-bit address space, theoretically providing approximately 4.29 billion (2³² = 4,294,967,296) unique addresses.',
    
    'ipv4.history.title': 'History and Development',
    'ipv4.history.content': 'IPv4 was developed by DARPA as part of the ARPANET project. On January 1, 1983, ARPANET officially switched from NCP to TCP/IP protocols, marking the birth of the modern Internet.',
    
    'ipv4.address.title': 'Address Structure and Representation',
    'ipv4.address.format': 'Address Format',
    'ipv4.address.format_desc': 'IPv4 addresses use dotted decimal notation. The 32-bit address is divided into 4 octets, each represented by a decimal number from 0-255, separated by dots.',
    'ipv4.address.binary': 'Binary Representation',
    'ipv4.address.binary_desc': 'Internally, IPv4 addresses are stored as 32-bit binary numbers. Understanding binary representation is essential for subnetting and troubleshooting.',
    'ipv4.address.conversion': 'Base Conversion Example',
    'ipv4.address.example': 'Example Address',
    'ipv4.address.decimal': 'Decimal',
    'ipv4.address.bin': 'Binary',
    
    'ipv4.classes.title': 'Address Classification System',
    'ipv4.classes.intro': 'IPv4 addresses originally used classful addressing, dividing addresses into classes A through E based on the first few bits. Although replaced by CIDR, understanding classful addressing remains important for learning networking fundamentals.',
    'ipv4.classes.class': 'Class',
    'ipv4.classes.range': 'Address Range',
    'ipv4.classes.mask': 'Default Mask',
    'ipv4.classes.networks': 'Networks',
    'ipv4.classes.hosts': 'Hosts',
    'ipv4.classes.usage': 'Usage',
    'ipv4.classes.high_bit': 'High Bits',
    
    'ipv4.classes.a_title': 'Class A Addresses',
    'ipv4.classes.a_desc': 'Class A addresses start with 0. Network portion: 8 bits, Host portion: 24 bits. Suitable for large networks with up to 16 million hosts.',
    'ipv4.classes.b_title': 'Class B Addresses',
    'ipv4.classes.b_desc': 'Class B addresses start with 10. Network portion: 16 bits, Host portion: 16 bits. Suitable for medium networks with up to 65,534 hosts.',
    'ipv4.classes.c_title': 'Class C Addresses',
    'ipv4.classes.c_desc': 'Class C addresses start with 110. Network portion: 24 bits, Host portion: 8 bits. Suitable for small networks with up to 254 hosts.',
    'ipv4.classes.d_title': 'Class D Addresses (Multicast)',
    'ipv4.classes.d_desc': 'Class D addresses start with 1110. Used for IP multicast, not assigned to individual hosts.',
    'ipv4.classes.e_title': 'Class E Addresses (Reserved)',
    'ipv4.classes.e_desc': 'Class E addresses start with 1111. Reserved for experimental use.',
    
    'ipv4.subnet.title': 'Subnetting Techniques',
    'ipv4.subnet.mask_title': 'Subnet Mask',
    'ipv4.subnet.mask_desc': 'A subnet mask is a 32-bit binary number that distinguishes the network portion from the host portion of an IP address. Network bits are all 1s, host bits are all 0s.',
    'ipv4.subnet.cidr_title': 'CIDR (Classless Inter-Domain Routing)',
    'ipv4.subnet.cidr_desc': 'CIDR was introduced in 1993 (RFC 1519), replacing classful addressing. CIDR uses "network/prefix" notation where prefix length indicates the number of network bits.',
    'ipv4.subnet.vlsm_title': 'VLSM (Variable Length Subnet Mask)',
    'ipv4.subnet.vlsm_desc': 'VLSM allows using different subnet mask lengths within the same network, enabling precise address allocation and maximizing address utilization.',
    'ipv4.subnet.calc': 'Subnet Calculation',
    'ipv4.subnet.network': 'Network Address',
    'ipv4.subnet.broadcast': 'Broadcast Address',
    'ipv4.subnet.first_host': 'First Host',
    'ipv4.subnet.last_host': 'Last Host',
    'ipv4.subnet.total_hosts': 'Usable Hosts',
    
    'ipv4.public_private.title': 'Public vs Private IP Addresses',
    'ipv4.public_private.intro': 'IP addresses are divided into public and private categories, a key concept for understanding modern network architecture.',
    'ipv4.public.title': 'Public IP Addresses',
    'ipv4.public.desc': 'Public IP addresses are globally unique addresses allocated by IANA and Regional Internet Registries (RIRs). They can be routed directly on the Internet.',
    'ipv4.public.features': 'Public IP Characteristics',
    'ipv4.public.feature1': 'Global uniqueness: Each public IP is unique worldwide',
    'ipv4.public.feature2': 'Routable: Can be routed directly on the Internet',
    'ipv4.public.feature3': 'Requires allocation: Assigned by ISPs or RIRs',
    'ipv4.public.feature4': 'Scarcity: IPv4 addresses have been exhausted',
    'ipv4.public.types': 'Public IP Types',
    'ipv4.public.type1': 'Static Public IP: Fixed assignment, commonly used for servers',
    'ipv4.public.type2': 'Dynamic Public IP: Temporary assignment, commonly used for home broadband',
    
    'ipv4.private.title': 'Private IP Addresses',
    'ipv4.private.desc': 'Private IP addresses are reserved addresses defined in RFC 1918 for internal network use. They are not routed on the public Internet.',
    'ipv4.private.ranges': 'Private Address Ranges',
    'ipv4.private.range_a': 'Class A Private: 10.0.0.0/8 (10.0.0.0 - 10.255.255.255)',
    'ipv4.private.range_b': 'Class B Private: 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)',
    'ipv4.private.range_c': 'Class C Private: 192.168.0.0/16 (192.168.0.0 - 192.168.255.255)',
    'ipv4.private.features': 'Private IP Characteristics',
    'ipv4.private.feature1': 'Address reuse: Different organizations can use the same private addresses',
    'ipv4.private.feature2': 'Not publicly routable: Filtered by public routers',
    'ipv4.private.feature3': 'Free to use: No allocation from IANA required',
    'ipv4.private.feature4': 'Requires NAT: Need Network Address Translation for Internet access',
    
    'ipv4.nat.title': 'NAT (Network Address Translation)',
    'ipv4.nat.intro': 'NAT is the key technology enabling communication between public and private IPs, solving IPv4 address shortage.',
    'ipv4.nat.snat': 'SNAT (Source NAT)',
    'ipv4.nat.snat_desc': 'Modifies the source IP address, used for internal networks accessing the Internet.',
    'ipv4.nat.dnat': 'DNAT (Destination NAT)',
    'ipv4.nat.dnat_desc': 'Modifies the destination IP address, used for port forwarding and load balancing.',
    'ipv4.nat.pat': 'PAT (Port Address Translation)',
    'ipv4.nat.pat_desc': 'Uses port numbers to distinguish connections, allowing multiple hosts to share one public IP.',
    'ipv4.nat.process': 'NAT Workflow',
    'ipv4.nat.step1': '1. Internal host sends packet with private source IP',
    'ipv4.nat.step2': '2. NAT gateway replaces source IP with public IP, records mapping',
    'ipv4.nat.step3': '3. Packet travels through Internet',
    'ipv4.nat.step4': '4. Response arrives at NAT gateway',
    'ipv4.nat.step5': '5. NAT gateway replaces destination IP back to private IP',
    'ipv4.nat.step6': '6. Packet forwarded to internal host',
    
    'ipv4.special.title': 'Special Purpose Addresses',
    'ipv4.special.loopback': 'Loopback Address',
    'ipv4.special.loopback_desc': '127.0.0.0/8 is reserved for local loopback testing. Packets to 127.0.0.1 (localhost) never leave the host.',
    'ipv4.special.linklocal': 'Link-Local Address',
    'ipv4.special.linklocal_desc': '169.254.0.0/16 is used for automatic configuration when DHCP is unavailable.',
    'ipv4.special.broadcast': 'Broadcast Address',
    'ipv4.special.broadcast_desc': 'Used to send packets to all hosts in a network. Limited broadcast: 255.255.255.255.',
    'ipv4.special.zero': 'All-Zero Address',
    'ipv4.special.zero_desc': '0.0.0.0/8 represents "this network", used for default routes or "any address".',
    
    'ipv4.header.title': 'IPv4 Header Structure',
    'ipv4.header.intro': 'The IPv4 header consists of a 20-byte fixed part and up to 40 bytes of options. Understanding header structure is essential for network programming and troubleshooting.',
    'ipv4.header.field': 'Field',
    'ipv4.header.bits': 'Bits',
    'ipv4.header.offset': 'Offset',
    'ipv4.header.desc': 'Description',
    'ipv4.header.version': 'Version',
    'ipv4.header.version_desc': '4 bits, IP version number (4 for IPv4)',
    'ipv4.header.ihl': 'IHL (Header Length)',
    'ipv4.header.ihl_desc': '4 bits, header length in 32-bit words, minimum 5 (20 bytes)',
    'ipv4.header.tos': 'ToS (Type of Service)',
    'ipv4.header.tos_desc': '8 bits, now used by DSCP and ECN for QoS',
    'ipv4.header.length': 'Total Length',
    'ipv4.header.length_desc': '16 bits, total packet length in bytes, max 65535',
    'ipv4.header.id': 'Identification',
    'ipv4.header.id_desc': '16 bits, used for fragment reassembly',
    'ipv4.header.flags': 'Flags',
    'ipv4.header.flags_desc': '3 bits: Reserved, DF (Don\'t Fragment), MF (More Fragments)',
    'ipv4.header.offset_field': 'Fragment Offset',
    'ipv4.header.offset_desc': '13 bits, position of fragment in original packet',
    'ipv4.header.ttl': 'TTL (Time To Live)',
    'ipv4.header.ttl_desc': '8 bits, maximum router hops, decremented per hop',
    'ipv4.header.protocol': 'Protocol',
    'ipv4.header.protocol_desc': '8 bits, upper layer protocol (TCP=6, UDP=17, ICMP=1)',
    'ipv4.header.checksum': 'Header Checksum',
    'ipv4.header.checksum_desc': '16 bits, integrity check for IPv4 header',
    'ipv4.header.src': 'Source Address',
    'ipv4.header.src_desc': '32 bits, sender\'s IPv4 address',
    'ipv4.header.dst': 'Destination Address',
    'ipv4.header.dst_desc': '32 bits, receiver\'s IPv4 address',
    'ipv4.header.options': 'Options',
    'ipv4.header.options_desc': 'Variable length, optional features, rarely used',
    
    'ipv4.fragmentation.title': 'IP Fragmentation and Reassembly',
    'ipv4.fragmentation.intro': 'When an IP packet exceeds the link MTU (Maximum Transmission Unit), fragmentation is required. Fragmentation occurs at routers, reassembly only at the destination.',
    'ipv4.fragmentation.mtu': 'MTU Values',
    'ipv4.fragmentation.mtu_ethernet': 'Ethernet: 1500 bytes',
    'ipv4.fragmentation.mtu_pppoe': 'PPPoE: 1492 bytes',
    'ipv4.fragmentation.mtu_tunnel': 'Tunnel interfaces: Usually smaller',
    'ipv4.fragmentation.mtu_loopback': 'Loopback: Usually 65535 bytes',
    'ipv4.fragmentation.pmtud': 'Path MTU Discovery (PMTUD)',
    'ipv4.fragmentation.pmtud_desc': 'PMTUD uses ICMP unreachable messages to discover minimum MTU along the path, avoiding fragmentation.',
    
    'ipv4.ttl.title': 'TTL (Time To Live)',
    'ipv4.ttl.intro': 'TTL is an 8-bit field that prevents packets from circulating indefinitely. Each router decrements TTL by 1. When TTL reaches 0, the packet is discarded and an ICMP timeout is returned.',
    'ipv4.ttl.default': 'Common Default Values',
    'ipv4.ttl.linux': 'Linux: 64',
    'ipv4.ttl.windows': 'Windows: 128',
    'ipv4.ttl.cisco': 'Cisco devices: 255',
    'ipv4.ttl.traceroute': 'Traceroute Principle',
    'ipv4.ttl.traceroute_desc': 'Traceroute uses TTL to trace routes by sending packets with incrementing TTL values and recording ICMP responses.',
    
    'ipv4.arp.title': 'ARP (Address Resolution Protocol)',
    'ipv4.arp.intro': 'ARP resolves IP addresses to MAC addresses, fundamental for LAN communication.',
    'ipv4.arp.process': 'ARP Workflow',
    'ipv4.arp.step1': '1. Host checks ARP cache for target IP\'s MAC',
    'ipv4.arp.step2': '2. If not found, broadcasts ARP request',
    'ipv4.arp.step3': '3. Target responds with ARP reply containing its MAC',
    'ipv4.arp.step4': '4. Sender caches the IP-MAC mapping',
    'ipv4.arp.cache': 'ARP Cache Management',
    'ipv4.arp.cache_desc': 'ARP cache stores IP-to-MAC mappings with aging mechanism.',
    'ipv4.arp.gratuitous': 'Gratuitous ARP',
    'ipv4.arp.gratuitous_desc': 'Host sends ARP request for its own IP to detect address conflicts and announce MAC changes.',
    'ipv4.arp.proxy': 'Proxy ARP',
    'ipv4.arp.proxy_desc': 'Router responds to ARP requests on behalf of remote hosts.',
    
    'ipv4.dhcp.title': 'DHCP (Dynamic Host Configuration Protocol)',
    'ipv4.dhcp.intro': 'DHCP automatically assigns IP addresses and network configuration to hosts.',
    'ipv4.dhcp.process': 'DHCP Workflow (DORA)',
    'ipv4.dhcp.discover': '1. DHCP Discover: Client broadcasts to find DHCP server',
    'ipv4.dhcp.offer': '2. DHCP Offer: Server offers IP address',
    'ipv4.dhcp.request': '3. DHCP Request: Client requests to use the address',
    'ipv4.dhcp.ack': '4. DHCP Ack: Server confirms and provides full configuration',
    'ipv4.dhcp.options': 'DHCP Options',
    'ipv4.dhcp.option_subnet': 'Subnet Mask',
    'ipv4.dhcp.option_router': 'Default Gateway',
    'ipv4.dhcp.option_dns': 'DNS Servers',
    'ipv4.dhcp.option_lease': 'Lease Time',
    'ipv4.dhcp.relay': 'DHCP Relay',
    'ipv4.dhcp.relay_desc': 'DHCP relay allows DHCP requests to cross network segments.',
    
    'ipv4.icmp.title': 'ICMP (Internet Control Message Protocol)',
    'ipv4.icmp.intro': 'ICMP conveys error messages and operational information, the foundation for Ping and Traceroute.',
    'ipv4.icmp.type': 'Type',
    'ipv4.icmp.code': 'Code',
    'ipv4.icmp.name': 'Name',
    'ipv4.icmp.meaning': 'Meaning',
    'ipv4.icmp.echo_reply': 'Echo Reply',
    'ipv4.icmp.echo_request': 'Echo Request',
    'ipv4.icmp.dest_unreach': 'Destination Unreachable',
    'ipv4.icmp.time_exceeded': 'Time Exceeded',
    'ipv4.icmp.redirect': 'Redirect',
    'ipv4.icmp.source_quench': 'Source Quench (deprecated)',
    'ipv4.icmp.ping': 'Ping Tool',
    'ipv4.icmp.ping_desc': 'Ping uses ICMP Echo Request/Reply to test connectivity and measure RTT.',
    
    'ipv4.igmp.title': 'IGMP (Internet Group Management Protocol)',
    'ipv4.igmp.intro': 'IGMP manages IP multicast group membership.',
    'ipv4.igmp.version': 'IGMP Versions',
    'ipv4.igmp.v1': 'IGMPv1: Supports joining groups, leaving requires timeout',
    'ipv4.igmp.v2': 'IGMPv2: Adds leave message, supports router election',
    'ipv4.igmp.v3': 'IGMPv3: Supports Source-Specific Multicast (SSM)',
    
    'ipv4.code.title': 'Code Examples',
    'ipv4.code.subtitle': 'Multi-language IPv4 Address Handling',
    
    // IPv6
    'ipv6.title': 'IPv6 (Internet Protocol version 6)',
    'ipv6.subtitle': 'Next Generation Internet Protocol',
    
    'ipv6.overview.title': 'Overview',
    'ipv6.overview.content': 'IPv6 is the next generation Internet Protocol, standardized in RFC 2460 by IETF in 1998. IPv6 uses 128-bit address space, providing approximately 3.4×10³⁸ addresses, fundamentally solving IPv4 address exhaustion.',
    
    'ipv6.history.title': 'History and Motivation',
    'ipv6.history.content': 'In the early 1990s, IETF foresaw IPv4 address exhaustion and started the IPng project. After evaluating multiple proposals, SIPP was selected and developed into IPv6.',
    
    'ipv6.address.title': 'Address Structure and Representation',
    'ipv6.address.format': 'Address Format',
    'ipv6.address.format_desc': 'IPv6 addresses use colon hexadecimal notation, dividing 128 bits into 8 groups of 16 bits.',
    'ipv6.address.compression': 'Address Compression Rules',
    'ipv6.address.rule1': 'Rule 1: Leading Zero Omission',
    'ipv6.address.rule1_desc': 'Leading zeros in each group can be omitted: 2001:0db8 → 2001:db8',
    'ipv6.address.rule2': 'Rule 2: Zero Compression',
    'ipv6.address.rule2_desc': 'Consecutive all-zero groups can be replaced with :: (once per address)',
    'ipv6.address.example': 'Address Examples',
    'ipv6.address.full': 'Full Form',
    'ipv6.address.compressed': 'Compressed Form',
    
    'ipv6.types.title': 'Address Types',
    'ipv6.types.intro': 'IPv6 addresses are divided into unicast, anycast, and multicast types.',
    'ipv6.types.unicast': 'Unicast Address',
    'ipv6.types.unicast_desc': 'One-to-one communication, identifies a single interface.',
    'ipv6.types.global_unicast': 'Global Unicast Address',
    'ipv6.types.global_unicast_desc': '2000::/3, globally routable, equivalent to IPv4 public address.',
    'ipv6.types.link_local': 'Link-Local Address',
    'ipv6.types.link_local_desc': 'fe80::/10, valid only on local link, not forwarded by routers.',
    'ipv6.types.unique_local': 'Unique Local Address',
    'ipv6.types.unique_local_desc': 'fc00::/7, equivalent to IPv4 private address.',
    'ipv6.types.anycast': 'Anycast Address',
    'ipv6.types.anycast_desc': 'One-to-nearest communication, routes to closest member.',
    'ipv6.types.multicast': 'Multicast Address',
    'ipv6.types.multicast_desc': 'One-to-many communication, ff00::/8 prefix.',
    
    'ipv6.header.title': 'IPv6 Header Structure',
    'ipv6.header.intro': 'IPv6 header is fixed at 40 bytes, significantly simplified compared to IPv4.',
    'ipv6.header.field': 'Field',
    'ipv6.header.bits': 'Bits',
    'ipv6.header.desc': 'Description',
    'ipv6.header.version': 'Version',
    'ipv6.header.version_desc': '4 bits, IP version (6 for IPv6)',
    'ipv6.header.traffic': 'Traffic Class',
    'ipv6.header.traffic_desc': '8 bits, similar to IPv4 ToS, for QoS',
    'ipv6.header.flow': 'Flow Label',
    'ipv6.header.flow_desc': '20 bits, identifies packets belonging to same flow',
    'ipv6.header.payload': 'Payload Length',
    'ipv6.header.payload_desc': '16 bits, length of data after header',
    'ipv6.header.next': 'Next Header',
    'ipv6.header.next_desc': '8 bits, type of next header or protocol',
    'ipv6.header.hop': 'Hop Limit',
    'ipv6.header.hop_desc': '8 bits, similar to IPv4 TTL',
    'ipv6.header.src': 'Source Address',
    'ipv6.header.src_desc': '128 bits, sender\'s IPv6 address',
    'ipv6.header.dst': 'Destination Address',
    'ipv6.header.dst_desc': '128 bits, receiver\'s IPv6 address',
    
    'ipv6.extension.title': 'Extension Headers',
    'ipv6.extension.intro': 'IPv6 uses extension header chain for optional functions.',
    'ipv6.extension.type': 'Type',
    'ipv6.extension.name': 'Header',
    'ipv6.extension.desc': 'Description',
    'ipv6.extension.hop': 'Hop-by-Hop Options',
    'ipv6.extension.hop_desc': 'Options processed by every router',
    'ipv6.extension.routing': 'Routing',
    'ipv6.extension.routing_desc': 'Source routing options',
    'ipv6.extension.fragment': 'Fragment',
    'ipv6.extension.fragment_desc': 'Fragmentation information',
    'ipv6.extension.esp': 'ESP',
    'ipv6.extension.esp_desc': 'IPsec encryption',
    'ipv6.extension.ah': 'AH',
    'ipv6.extension.ah_desc': 'IPsec authentication',
    'ipv6.extension.dest': 'Destination Options',
    'ipv6.extension.dest_desc': 'Options for destination node',
    
    'ipv6.slaac.title': 'SLAAC (Stateless Address Autoconfiguration)',
    'ipv6.slaac.intro': 'IPv6 supports SLAAC, allowing hosts to automatically generate globally unique addresses without DHCP.',
    'ipv6.slaac.process': 'SLAAC Workflow',
    'ipv6.slaac.step1': '1. Host generates link-local address (fe80::)',
    'ipv6.slaac.step2': '2. Sends Router Solicitation (RS)',
    'ipv6.slaac.step3': '3. Router responds with Router Advertisement (RA) containing prefix',
    'ipv6.slaac.step4': '4. Host generates global address using prefix + interface ID',
    'ipv6.slaac.step5': '5. Performs Duplicate Address Detection (DAD)',
    'ipv6.slaac.eui64': 'EUI-64 Interface Identifier',
    'ipv6.slaac.eui64_desc': 'EUI-64 expands 48-bit MAC to 64-bit interface ID by inserting FFFE and flipping bit 7.',
    
    'ipv6.ndp.title': 'NDP (Neighbor Discovery Protocol)',
    'ipv6.ndp.intro': 'NDP uses ICMPv6 for address resolution, router discovery, and replaces IPv4 ARP.',
    'ipv6.ndp.type': 'Type',
    'ipv6.ndp.name': 'Name',
    'ipv6.ndp.function': 'Function',
    'ipv6.ndp.rs': 'Router Solicitation',
    'ipv6.ndp.rs_desc': 'Host requests router to send RA',
    'ipv6.ndp.ra': 'Router Advertisement',
    'ipv6.ndp.ra_desc': 'Router advertises network information',
    'ipv6.ndp.ns': 'Neighbor Solicitation',
    'ipv6.ndp.ns_desc': 'Address resolution and DAD',
    'ipv6.ndp.na': 'Neighbor Advertisement',
    'ipv6.ndp.na_desc': 'Responds to NS with MAC address',
    'ipv6.ndp.redirect': 'Redirect',
    'ipv6.ndp.redirect_desc': 'Notifies better next hop',
    
    'ipv6.transition.title': 'Transition Technologies',
    'ipv6.transition.intro': 'IPv4 and IPv6 are incompatible, requiring transition technologies for migration.',
    'ipv6.transition.dual': 'Dual Stack',
    'ipv6.transition.dual_desc': 'Devices run both IPv4 and IPv6 stacks simultaneously.',
    'ipv6.transition.tunnel': 'Tunneling',
    'ipv6.transition.tunnel_desc': 'Encapsulating IPv6 in IPv4: 6to4, Teredo, ISATAP.',
    'ipv6.transition.nat64': 'NAT64/DNS64',
    'ipv6.transition.nat64_desc': 'Access IPv4 resources from IPv6-only networks.',
    
    'ipv6.mobile.title': 'Mobile IPv6',
    'ipv6.mobile.intro': 'Mobile IPv6 provides native mobility support for seamless handoffs.',
    'ipv6.mobile.concept': 'Core Concepts',
    'ipv6.mobile.hoa': 'Home Address: Device\'s permanent address',
    'ipv6.mobile.coa': 'Care-of Address: Temporary address at visited network',
    'ipv6.mobile.ha': 'Home Agent: Router at home network',
    
    'ipv6.mld.title': 'MLD (Multicast Listener Discovery)',
    'ipv6.mld.intro': 'MLD is IPv6\'s multicast group management protocol, equivalent to IGMP.',
    'ipv6.mld.version': 'MLD Versions',
    'ipv6.mld.v1': 'MLDv1: Equivalent to IGMPv2',
    'ipv6.mld.v2': 'MLDv2: Equivalent to IGMPv3, supports SSM',
    
    'ipv6.code.title': 'Code Examples',
    'ipv6.code.subtitle': 'Multi-language IPv6 Address Handling',
    
    // Comparison
    'comparison.title': 'IPv4 vs IPv6 Comparison',
    'comparison.subtitle': 'Protocol Features and Capabilities',
    'comparison.feature': 'Feature',
    'comparison.ipv4': 'IPv4',
    'comparison.ipv6': 'IPv6',
    
    // Routing
    'routing.title': 'IP Routing Principles',
    'routing.subtitle': 'Routing Decisions and Protocols',
    'routing.table.title': 'Routing Table',
    'routing.table.intro': 'Routing table is the core data structure for routing decisions.',
    'routing.match.title': 'Longest Prefix Match',
    'routing.match.intro': 'Routing follows the longest prefix match principle.',
    'routing.static.title': 'Static Routing',
    'routing.static.intro': 'Static routes are manually configured by administrators.',
    'routing.dynamic.title': 'Dynamic Routing Protocols',
    'routing.ospf': 'OSPF (Open Shortest Path First): Link-state protocol',
    'routing.bgp': 'BGP (Border Gateway Protocol): Path vector protocol, Internet core',
    'routing.rip': 'RIP (Routing Information Protocol): Distance vector, small networks',
    'routing.isis': 'IS-IS: Link-state protocol, carrier networks',
    
    // DNS
    'dns.title': 'IP and DNS (Domain Name System)',
    'dns.subtitle': 'Domain Resolution and IP Mapping',
    'dns.intro': 'DNS converts human-readable domain names to IP addresses.',
    'dns.records.title': 'DNS Record Types',
    'dns.records.type': 'Type',
    'dns.records.name': 'Name',
    'dns.records.desc': 'Description',
    'dns.records.a': 'A Record',
    'dns.records.a_desc': 'Domain to IPv4 address mapping',
    'dns.records.aaaa': 'AAAA Record',
    'dns.records.aaaa_desc': 'Domain to IPv6 address mapping',
    'dns.records.ptr': 'PTR Record',
    'dns.records.ptr_desc': 'Reverse DNS lookup',
    'dns.records.ns': 'NS Record',
    'dns.records.ns_desc': 'Authoritative nameserver',
    'dns.records.mx': 'MX Record',
    'dns.records.mx_desc': 'Mail exchange server',
    'dns.records.cname': 'CNAME Record',
    'dns.records.cname_desc': 'Domain alias',
    'dns.records.txt': 'TXT Record',
    'dns.records.txt_desc': 'Text record for SPF, DKIM',
    'dns.records.srv': 'SRV Record',
    'dns.records.srv_desc': 'Service location record',
    'dns.process.title': 'DNS Resolution Process',
    'dns.recursive': 'Recursive Query',
    'dns.iterative': 'Iterative Query',
    'dns.cache': 'DNS Caching',
    'dns.dnssec': 'DNSSEC Security Extensions',
    
    // CDN
    'cdn.title': 'IP and CDN (Content Delivery Network)',
    'cdn.subtitle': 'Content Acceleration and IP Scheduling',
    'cdn.intro': 'CDN deploys edge nodes globally for faster content delivery.',
    'cdn.principle.title': 'CDN Working Principle',
    'cdn.anycast.title': 'Anycast Technology',
    'cdn.anycast.intro': 'Anycast allows multiple servers to use the same IP, routing to the nearest.',
    'cdn.edge': 'Edge Nodes',
    'cdn.cache': 'Caching Strategies',
    'cdn.load_balance': 'Load Balancing',
    'cdn.geo_dns': 'GeoDNS',
    
    // Transport
    'transport.title': 'IP and Transport Layer',
    'transport.subtitle': 'TCP/IP Protocol Stack',
    'transport.intro': 'Transport layer provides end-to-end data transmission services.',
    'transport.tcp.title': 'TCP (Transmission Control Protocol)',
    'transport.tcp.intro': 'TCP is a connection-oriented reliable transport protocol.',
    'transport.tcp.features': 'TCP Features',
    'transport.tcp.connection': 'Connection-oriented: 3-way handshake',
    'transport.tcp.reliable': 'Reliable: ACK and retransmission',
    'transport.tcp.flow': 'Flow control: Sliding window',
    'transport.tcp.congestion': 'Congestion control: Slow start',
    'transport.udp.title': 'UDP (User Datagram Protocol)',
    'transport.udp.intro': 'UDP is a connectionless unreliable transport protocol.',
    'transport.udp.features': 'UDP Features',
    'transport.udp.connectionless': 'Connectionless',
    'transport.udp.fast': 'Fast: No ACK overhead',
    'transport.udp.unreliable': 'Unreliable',
    'transport.port.title': 'Port Numbers',
    'transport.port.intro': 'Port numbers identify applications on a host (0-65535).',
    'transport.port.wellknown': 'Well-Known Ports (0-1023)',
    'transport.port.registered': 'Registered Ports (1024-49151)',
    'transport.port.dynamic': 'Dynamic Ports (49152-65535)',
    
    // GeoIP
    'geoip.title': 'IP Geolocation (GeoIP)',
    'geoip.subtitle': 'Determining Location from IP Address',
    'geoip.intro': 'IP geolocation determines geographic location from IP addresses.',
    'geoip.principle.title': 'GeoIP Principle',
    'geoip.principle.intro': 'GeoIP is based on WHOIS data, BGP routing info, and user-contributed data.',
    'geoip.database.title': 'GeoIP Databases',
    'geoip.accuracy.title': 'Accuracy',
    'geoip.accuracy.country': 'Country level: 95-99%',
    'geoip.accuracy.city': 'City level: 50-80%',
    'geoip.privacy': 'Privacy Concerns',
    
    // Multicast
    'multicast.title': 'IP Multicast',
    'multicast.subtitle': 'Efficient One-to-Many Communication',
    'multicast.intro': 'IP multicast enables efficient one-to-many data transmission.',
    'multicast.address.title': 'Multicast Addresses',
    'multicast.address.intro': 'IPv4 multicast range: 224.0.0.0 - 239.255.255.255',
    'multicast.igmp.title': 'IGMP Protocol',
    'multicast.routing.title': 'Multicast Routing',
    'multicast.pim': 'PIM Protocol',
    
    // QoS
    'qos.title': 'IP QoS (Quality of Service)',
    'qos.subtitle': 'Traffic Priority and Service Guarantees',
    'qos.intro': 'QoS ensures critical applications get required network resources.',
    'qos.dscp.title': 'DSCP (Differentiated Services Code Point)',
    'qos.dscp.intro': 'DSCP marks packet priority in ToS/Traffic Class field.',
    'qos.traffic_shaping': 'Traffic Shaping',
    'qos.congestion': 'Congestion Control',
    'qos.priority': 'Priority Queuing',
    
    // Security
    'security.title': 'IP Security',
    'security.subtitle': 'Network Security Mechanisms',
    'security.intro': 'IP security covers encryption, authentication, and access control.',
    'security.ipsec.title': 'IPsec (IP Security)',
    'security.ipsec.intro': 'IPsec provides security at the network layer.',
    'security.ah': 'AH (Authentication Header)',
    'security.ah_desc': 'Provides integrity and authentication, no encryption',
    'security.esp': 'ESP (Encapsulating Security Payload)',
    'security.esp_desc': 'Provides encryption, integrity, and authentication',
    'security.ike': 'IKE (Internet Key Exchange)',
    'security.ike_desc': 'Automatically negotiates security associations and keys',
    'security.vpn.title': 'VPN (Virtual Private Network)',
    'security.vpn.intro': 'VPN creates secure tunnels over public networks.',
    'security.firewall': 'Firewall',
    'security.ids': 'Intrusion Detection System',
    'security.ddos': 'DDoS Protection',
    'security.spoofing': 'IP Spoofing Prevention',
    
    // Tunnel
    'tunnel.title': 'IP Tunneling Technologies',
    'tunnel.subtitle': 'Network Interconnection and Protocol Transition',
    'tunnel.intro': 'IP tunneling encapsulates one protocol in another for transmission.',
    'tunnel.gre.title': 'GRE (Generic Routing Encapsulation)',
    'tunnel.gre_desc': 'Generic tunnel protocol, can encapsulate multiple protocols',
    'tunnel.ipsec.title': 'IPsec Tunnel',
    'tunnel.ipsec_desc': 'Encrypted tunnel mode with security',
    'tunnel.6to4.title': '6to4',
    'tunnel.6to4_desc': 'IPv6 over IPv4 automatic tunneling',
    'tunnel.teredo.title': 'Teredo',
    'tunnel.teredo_desc': 'IPv6 through NAT using UDP',
    'tunnel.isatap.title': 'ISATAP',
    'tunnel.isatap_desc': 'Intra-site IPv6 tunneling',
    'tunnel.wireguard.title': 'WireGuard',
    'tunnel.wireguard_desc': 'Modern, fast, secure VPN protocol',
    
    // Future
    'future.title': 'IP Future Evolution',
    'future.subtitle': 'Technology Development Trends',
    'future.intro': 'IP protocol continues to evolve with new technologies and applications.',
    'future.iot.title': 'IoT (Internet of Things)',
    'future.iot.intro': 'By 2030, over 50 billion IoT devices expected. IPv6\'s massive address space is key.',
    'future.5g.title': '5G and IPv6',
    'future.5g.intro': '5G networks natively support IPv6 with lower latency and higher density.',
    'future.sdn.title': 'SDN/NFV',
    'future.sdn.intro': 'Software-Defined Networking and Network Function Virtualization are reshaping network architecture.',
    'future.edge.title': 'Edge Computing',
    'future.edge.intro': 'Edge computing brings computation closer to users, reducing latency.',
    'future.sr.title': 'Segment Routing',
    'future.sr.intro': 'Segment Routing is a new source routing architecture, simplifying MPLS and traffic engineering.',
    
    // Code
    'code.copy': 'Copy',
    'code.copied': 'Copied',
    
    // Footer
    'footer.docs': 'IP Technical Documentation',
    'footer.built': 'Built with Next.js',
    'footer.rights': 'All Rights Reserved',
  }
}

// ============================================
// Provider 组件（修复预渲染 lang 未定义）
// ============================================
function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  // 核心修改：区分预渲染/客户端环境，避免读取 localStorage 报错
  const [lang, setLang] = useState<Language>(() => {
    // 客户端环境才读取 localStorage，预渲染时返回默认值 'zh'
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('lang') as Language) || 'zh';
    }
    return 'zh'; // 预渲染阶段强制兜底
  })
  
  // 核心修改：t 函数加双重兜底，防止 lang 异常导致 translations[lang] 不存在
  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.zh?.[key] || key
  }
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <I18nContext.Provider value={{ lang, setLang, t }}>
        {children}
      </I18nContext.Provider>
    </ThemeContext.Provider>
  )
}

// ============================================
// 代码块组件
// ============================================
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)
  const { t } = useI18n()
  const { theme } = useTheme()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`relative group rounded-lg overflow-hidden border my-3 ${theme === 'dark' ? 'border-border bg-muted/30' : 'border-gray-200 bg-gray-50'}`}>
      <div className={`flex items-center justify-between px-3 sm:px-4 py-2 border-b ${theme === 'dark' ? 'border-border bg-muted/50' : 'border-gray-200 bg-gray-100'}`}>
        <span className={`text-xs sm:text-sm font-mono ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{language}</span>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 sm:h-7 px-2 ${theme === 'dark' ? 'text-muted-foreground hover:text-foreground' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={copyToClipboard}
        >
          {copied ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4" />}
          <span className="ml-1 text-xs hidden sm:inline">{copied ? t('code.copied') : t('code.copy')}</span>
        </Button>
      </div>
      <pre className="p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm leading-relaxed max-h-80">
        <code className={`font-mono whitespace-pre ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{code}</code>
      </pre>
    </div>
  )
}

// ============================================
// 导航目录组件
// ============================================
function TableOfContents({ activeSection }: { activeSection: string }) {
  const { t, lang } = useI18n()
  const { theme } = useTheme()
  
  const sections = [
    { id: 'hero', title: lang === 'zh' ? '首页' : 'Home' },
    { id: 'ipv4', title: lang === 'zh' ? 'IPv4协议' : 'IPv4 Protocol' },
    { id: 'ipv6', title: lang === 'zh' ? 'IPv6协议' : 'IPv6 Protocol' },
    { id: 'comparison', title: lang === 'zh' ? '协议对比' : 'Comparison' },
    { id: 'routing', title: lang === 'zh' ? 'IP路由' : 'IP Routing' },
    { id: 'dns', title: 'DNS' },
    { id: 'cdn', title: 'CDN' },
    { id: 'transport', title: lang === 'zh' ? '传输层' : 'Transport' },
    { id: 'geoip', title: lang === 'zh' ? '地理定位' : 'GeoIP' },
    { id: 'multicast', title: lang === 'zh' ? '组播' : 'Multicast' },
    { id: 'qos', title: 'QoS' },
    { id: 'security', title: lang === 'zh' ? '安全' : 'Security' },
    { id: 'tunnel', title: lang === 'zh' ? '隧道' : 'Tunnel' },
    { id: 'future', title: lang === 'zh' ? '未来' : 'Future' },
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40">
      <div className={`rounded-lg p-2 shadow-lg max-w-[160px] ${theme === 'dark' ? 'bg-card/80 backdrop-blur-md border border-border' : 'bg-white/90 backdrop-blur-md border border-gray-200'}`}>
        <ul className="space-y-0.5">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`text-xs px-2 py-1 rounded transition-all w-full text-left truncate ${
                  activeSection === section.id
                    ? 'bg-primary/20 text-primary font-medium'
                    : theme === 'dark' 
                      ? 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

// ============================================
// 固定导航栏
// ============================================
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { lang, setLang, t } = useI18n()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  const navItems = [
    { id: 'ipv4', label: t('nav.ipv4_short') },
    { id: 'ipv6', label: t('nav.ipv6_short') },
    { id: 'comparison', label: t('nav.comparison_short') },
    { id: 'routing', label: t('nav.routing_short') },
    { id: 'dns', label: t('nav.dns_short') },
    { id: 'cdn', label: t('nav.cdn_short') },
    { id: 'transport', label: t('nav.transport_short') },
    { id: 'geoip', label: t('nav.geoip_short') },
    { id: 'multicast', label: t('nav.multicast_short') },
    { id: 'qos', label: t('nav.qos_short') },
    { id: 'security', label: t('nav.security_short') },
    { id: 'tunnel', label: t('nav.tunnel_short') },
    { id: 'future', label: t('nav.future_short') },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? theme === 'dark'
            ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {SITE_CONFIG.logoUrl ? (
              <img src={SITE_CONFIG.logoUrl} alt="Logo" className="h-6 w-6 sm:h-7 sm:w-7" />
            ) : (
              <Network className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            )}
            <span className="font-bold text-base sm:text-lg text-primary">{SITE_CONFIG.siteName}</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-0.5 flex-wrap">
            {navItems.slice(0, 8).map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.id)}
                className={`text-xs px-2 ${theme === 'dark' ? 'text-muted-foreground hover:text-foreground' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {item.label}
              </Button>
            ))}
            {/* 主题切换 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`ml-1 ${theme === 'dark' ? 'text-muted-foreground hover:text-foreground' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {/* 语言切换 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className={theme === 'dark' ? 'text-muted-foreground hover:text-foreground' : 'text-gray-600 hover:text-gray-900'}
            >
              <Languages className="h-4 w-4 mr-1" />
              {lang === 'zh' ? 'EN' : '中文'}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1 xl:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={theme === 'dark' ? 'text-muted-foreground hover:text-foreground' : 'text-gray-600 hover:text-gray-900'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className={theme === 'dark' ? 'text-muted-foreground hover:text-foreground' : 'text-gray-600 hover:text-gray-900'}
            >
              <Languages className="h-4 w-4" />
              {lang === 'zh' ? 'EN' : '中'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={theme === 'dark' ? 'text-muted-foreground hover:text-foreground' : 'text-gray-600 hover:text-gray-900'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className={`xl:hidden py-3 border-t max-h-[70vh] overflow-y-auto ${theme === 'dark' ? 'border-border bg-background/95' : 'border-gray-200 bg-white/95'} backdrop-blur-md`}>
            <nav className="grid grid-cols-3 sm:grid-cols-4 gap-1 px-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(item.id)}
                  className={`justify-start text-xs ${theme === 'dark' ? 'text-muted-foreground hover:text-foreground' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// ============================================
// Hero 区域
// ============================================
function Hero() {
  const { t } = useI18n()
  const { theme } = useTheme()
  
  return (
    <section id="hero" className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
          <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
          {t('hero.badge')}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
          <span className="text-primary">{t('hero.title')}</span>
        </h1>
        <p className="text-lg sm:text-xl mb-3 sm:mb-4 text-primary font-medium">
          {t('hero.subtitle')}
        </p>
        <p className={`text-sm sm:text-base max-w-2xl mx-auto mb-6 sm:mb-8 px-2 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
          {t('hero.description')}
        </p>
        <Button 
          size="lg" 
          onClick={() => document.getElementById('ipv4')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-sm sm:text-base"
        >
          {t('hero.start')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {/* 统计 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-10 sm:mt-16 max-w-2xl mx-auto">
          {[
            ['32', t('stats.ipv4_bits')],
            ['128', t('stats.ipv6_bits')],
            ['50+', t('stats.protocols')],
            ['9000+', t('stats.rfcs')],
          ].map(([value, label], i) => (
            <div key={i} className={`text-center p-3 sm:p-4 rounded-lg border ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
              <div className="text-xl sm:text-2xl font-bold text-primary">{value}</div>
              <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// 通用章节组件
// ============================================
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme()
  return (
    <Card className={`border ${theme === 'dark' ? 'border-border bg-card/50' : 'border-gray-200 bg-white'}`}>
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

// 高亮文本
function HL({ children }: { children: React.ReactNode }) {
  return <span className="text-primary font-medium">{children}</span>
}

// 高亮文本（粗体绿色）
function Key({ children }: { children: React.ReactNode }) {
  return <span className="text-primary font-bold">{children}</span>
}

// ============================================
// IPv4 文档部分
// ============================================
function IPv4Section() {
  const { t, lang } = useI18n()
  const { theme } = useTheme()
  
  return (
    <section id="ipv4" className="py-10 sm:py-16 px-3 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
            <Server className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{t('ipv4.title')}</h2>
            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('ipv4.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* 概述 */}
          <SectionCard title={t('ipv4.overview.title')}>
            <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('ipv4.overview.content')}
            </p>
          </SectionCard>

          {/* 历史背景 */}
          <SectionCard title={t('ipv4.history.title')}>
            <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('ipv4.history.content')}
            </p>
          </SectionCard>

          {/* 地址结构 */}
          <SectionCard title={t('ipv4.address.title')}>
            <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('ipv4.address.format_desc')}
            </p>
            <div className={`rounded-lg p-3 sm:p-4 border ${theme === 'dark' ? 'bg-muted/30 border-border' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-mono font-bold text-primary mb-1">192.168.1.1</div>
                <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
                  {t('ipv4.address.binary')}: <span className="font-mono">11000000.10101000.00000001.00000001</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1 sm:gap-2 mt-3 text-center text-xs">
              {['192', '168', '1', '1'].map((num, i) => (
                <div key={i} className={`p-1.5 sm:p-2 rounded border ${theme === 'dark' ? 'bg-muted/30 border-border' : 'bg-gray-50 border-gray-200'}`}>
                  <div className={`font-mono font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{num}</div>
                  <div className={`font-mono mt-0.5 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
                    {parseInt(num).toString(2).padStart(8, '0')}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 地址分类 */}
          <SectionCard title={t('ipv4.classes.title')}>
            <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('ipv4.classes.intro')}
            </p>
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="min-w-[600px] px-3 sm:px-0">
                <Table>
                  <TableHeader>
                    <TableRow className={theme === 'dark' ? 'border-border' : 'border-gray-200'}>
                      <TableHead className={theme === 'dark' ? 'text-foreground' : 'text-gray-900'}>{t('ipv4.classes.class')}</TableHead>
                      <TableHead className={theme === 'dark' ? 'text-foreground' : 'text-gray-900'}>{t('ipv4.classes.range')}</TableHead>
                      <TableHead className={theme === 'dark' ? 'text-foreground' : 'text-gray-900'}>{t('ipv4.classes.mask')}</TableHead>
                      <TableHead className={theme === 'dark' ? 'text-foreground' : 'text-gray-900'}>{t('ipv4.classes.networks')}</TableHead>
                      <TableHead className={theme === 'dark' ? 'text-foreground' : 'text-gray-900'}>{t('ipv4.classes.hosts')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ['A', '1.0.0.0 - 126.255.255.255', '255.0.0.0', '126', '16,777,214'],
                      ['B', '128.0.0.0 - 191.255.255.255', '255.255.0.0', '16,384', '65,534'],
                      ['C', '192.0.0.0 - 223.255.255.255', '255.255.255.0', '2,097,152', '254'],
                      ['D', '224.0.0.0 - 239.255.255.255', 'N/A', 'N/A', 'N/A'],
                      ['E', '240.0.0.0 - 255.255.255.255', 'N/A', 'N/A', 'N/A'],
                    ].map(([cls, range, mask, networks, hosts], i) => (
                      <TableRow key={i} className={theme === 'dark' ? 'border-border' : 'border-gray-200'}>
                        <TableCell className="font-medium text-primary">{cls}</TableCell>
                        <TableCell className="font-mono text-xs">{range}</TableCell>
                        <TableCell className="font-mono">{mask}</TableCell>
                        <TableCell>{networks}</TableCell>
                        <TableCell>{hosts}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="grid gap-2 mt-4">
              {[
                ['A', 'ipv4.classes.a_title', 'ipv4.classes.a_desc', '0'],
                ['B', 'ipv4.classes.b_title', 'ipv4.classes.b_desc', '10'],
                ['C', 'ipv4.classes.c_title', 'ipv4.classes.c_desc', '110'],
              ].map(([cls, titleKey, descKey, bits]) => (
                <div key={cls} className={`p-2 sm:p-3 rounded border ${theme === 'dark' ? 'bg-muted/20 border-border' : 'bg-gray-50 border-gray-200'}`}>
                  <h4 className="font-semibold text-foreground text-sm">{t(titleKey)}</h4>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t(descKey)}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 子网划分 */}
          <SectionCard title={t('ipv4.subnet.title')}>
            <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('ipv4.subnet.mask_desc')}
            </p>
            <div className={`rounded-lg p-3 sm:p-4 border mb-3 ${theme === 'dark' ? 'bg-muted/30 border-border' : 'bg-gray-50 border-gray-200'}`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm">
                <div>
                  <div className={theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}>IP</div>
                  <div className="font-mono text-primary">192.168.1.100</div>
                </div>
                <div>
                  <div className={theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}>Mask</div>
                  <div className="font-mono">255.255.255.0</div>
                </div>
                <div>
                  <div className={theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}>{t('ipv4.subnet.network')}</div>
                  <div className="font-mono text-primary">192.168.1.0</div>
                </div>
                <div>
                  <div className={theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}>{t('ipv4.subnet.broadcast')}</div>
                  <div className="font-mono text-primary">192.168.1.255</div>
                </div>
              </div>
            </div>
            <h4 className="font-semibold text-foreground mt-4 mb-2 text-sm">{t('ipv4.subnet.cidr_title')}</h4>
            <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('ipv4.subnet.cidr_desc')}
            </p>
            <div className="overflow-x-auto -mx-3 sm:mx-0 mt-3">
              <div className="min-w-[400px] px-3 sm:px-0">
                <Table>
                  <TableHeader>
                    <TableRow className={theme === 'dark' ? 'border-border' : 'border-gray-200'}>
                      <TableHead className={theme === 'dark' ? 'text-foreground' : 'text-gray-900'}>CIDR</TableHead>
                      <TableHead className={theme === 'dark' ? 'text-foreground' : 'text-gray-900'}>Mask</TableHead>
                      <TableHead className={theme === 'dark' ? 'text-foreground' : 'text-gray-900'}>{t('ipv4.subnet.total_hosts')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ['/8', '255.0.0.0', '16,777,214'],
                      ['/16', '255.255.0.0', '65,534'],
                      ['/24', '255.255.255.0', '254'],
                      ['/25', '255.255.255.128', '126'],
                      ['/26', '255.255.255.192', '62'],
                      ['/27', '255.255.255.224', '30'],
                      ['/28', '255.255.255.240', '14'],
                      ['/29', '255.255.255.248', '6'],
                      ['/30', '255.255.255.252', '2'],
                    ].map(([cidr, mask, hosts]) => (
                      <TableRow key={cidr} className={theme === 'dark' ? 'border-border' : 'border-gray-200'}>
                        <TableCell className="font-mono text-primary">{cidr}</TableCell>
                        <TableCell className="font-mono">{mask}</TableCell>
                        <TableCell>{hosts}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </SectionCard>

          {/* 公网IP与内网IP */}
          <SectionCard title={t('ipv4.public_private.title')}>
            <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('ipv4.public_private.intro')}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className={`p-3 sm:p-4 rounded-lg border ${theme === 'dark' ? 'bg-muted/20 border-border' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className="font-semibold text-foreground mb-2 text-sm">{t('ipv4.public.title')}</h4>
                <p className={`text-xs sm:text-sm leading-relaxed mb-2 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
                  {t('ipv4.public.desc')}
                </p>
                <ul className={`text-xs space-y-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
                  <li>• {t('ipv4.public.feature1')}</li>
                  <li>• {t('ipv4.public.feature2')}</li>
                  <li>• {t('ipv4.public.feature3')}</li>
                </ul>
              </div>
              <div className={`p-3 sm:p-4 rounded-lg border ${theme === 'dark' ? 'bg-muted/20 border-border' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className="font-semibold text-foreground mb-2 text-sm">{t('ipv4.private.title')}</h4>
                <p className={`text-xs sm:text-sm leading-relaxed mb-2 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
                  {t('ipv4.private.desc')}
                </p>
                <div className={`text-xs space-y-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
                  <div><HL>10.0.0.0/8</HL> - {lang === 'zh' ? 'A类私有' : 'Class A Private'}</div>
                  <div><HL>172.16.0.0/12</HL> - {lang === 'zh' ? 'B类私有' : 'Class B Private'}</div>
                  <div><HL>192.168.0.0/16</HL> - {lang === 'zh' ? 'C类私有' : 'Class C Private'}</div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* NAT */}
          <SectionCard title={t('ipv4.nat.title')}>
            <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('ipv4.nat.intro')}
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ['ipv4.nat.snat', 'ipv4.nat.snat_desc'],
                ['ipv4.nat.dnat', 'ipv4.nat.dnat_desc'],
                ['ipv4.nat.pat', 'ipv4.nat.pat_desc'],
              ].map(([title, desc]) => (
                <div key={title} className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-muted/20 border-border' : 'bg-gray-50 border-gray-200'}`}>
                  <h4 className="font-semibold text-foreground mb-1 text-sm">{t(title)}</h4>
                  <p className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t(desc)}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 报文头部 */}
          <SectionCard title={t('ipv4.header.title')}>
            <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('ipv4.header.intro')}
            </p>
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="min-w-[500px] px-3 sm:px-0">
                <Table>
                  <TableHeader>
                    <TableRow className={theme === 'dark' ? 'border-border' : 'border-gray-200'}>
                      <TableHead className={theme === 'dark' ? 'text-foreground' : 'text-gray-900'}>{t('ipv4.header.field')}</TableHead>
                      <TableHead className={theme === 'dark' ? 'text-foreground' : 'text-gray-900'}>{t('ipv4.header.bits')}</TableHead>
                      <TableHead className={theme === 'dark' ? 'text-foreground' : 'text-gray-900'}>{t('ipv4.header.desc')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ['ipv4.header.version', '4', 'ipv4.header.version_desc'],
                      ['ipv4.header.ihl', '4', 'ipv4.header.ihl_desc'],
                      ['ipv4.header.tos', '8', 'ipv4.header.tos_desc'],
                      ['ipv4.header.length', '16', 'ipv4.header.length_desc'],
                      ['ipv4.header.ttl', '8', 'ipv4.header.ttl_desc'],
                      ['ipv4.header.protocol', '8', 'ipv4.header.protocol_desc'],
                      ['ipv4.header.checksum', '16', 'ipv4.header.checksum_desc'],
                      ['ipv4.header.src', '32', 'ipv4.header.src_desc'],
                      ['ipv4.header.dst', '32', 'ipv4.header.dst_desc'],
                    ].map(([field, bits, desc]) => (
                      <TableRow key={field} className={theme === 'dark' ? 'border-border' : 'border-gray-200'}>
                        <TableCell className="font-medium text-primary text-xs">{t(field)}</TableCell>
                        <TableCell className="text-xs">{bits}</TableCell>
                        <TableCell className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t(desc)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </SectionCard>

          {/* 代码示例 */}
          <SectionCard title={t('ipv4.code.title')}>
            <h4 className="font-semibold text-foreground mb-2 text-sm">JavaScript/TypeScript</h4>
            <CodeBlock
              language="typescript"
              code={`// IPv4 address validation
const isIPv4 = (ip: string): boolean => {
  const regex = /^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)$/;
  return regex.test(ip);
};

// Check if IP is private
const isPrivateIP = (ip: string): boolean => {
  const parts = ip.split('.').map(Number);
  if (parts[0] === 10) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  return false;
};

// Get network address
const getNetwork = (ip: string, cidr: number): string => {
  const parts = ip.split('.').map(Number);
  const mask = Array(4).fill(0).map((_, i) => 
    256 - Math.pow(2, Math.max(0, 8 - Math.max(0, cidr - i * 8)))
  );
  return parts.map((p, i) => p & mask[i]).join('.');
};

console.log(isIPv4('192.168.1.1'));      // true
console.log(isPrivateIP('192.168.1.1')); // true
console.log(getNetwork('192.168.1.100', 24)); // 192.168.1.0`}
            />
            <h4 className="font-semibold text-foreground mb-2 mt-4 text-sm">Python</h4>
            <CodeBlock
              language="python"
              code={`import ipaddress
import socket

def get_local_ip():
    """Get local IP address"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except: return '127.0.0.1'

def validate_ipv4(ip: str) -> bool:
    try:
        ipaddress.IPv4Address(ip)
        return True
    except: return False

def get_network_info(ip: str, cidr: int):
    net = ipaddress.IPv4Network(f'{ip}/{cidr}', strict=False)
    return {
        'network': str(net.network_address),
        'broadcast': str(net.broadcast_address),
        'mask': str(net.netmask),
        'hosts': net.num_addresses - 2
    }

print(f"Local IP: {get_local_ip()}")
print(f"Network: {get_network_info('192.168.1.100', 24)}")`}
            />
          </SectionCard>
        </div>
      </div>
    </section>
  )
}

// ============================================
// IPv6 文档部分（简化版）
// ============================================
function IPv6Section() {
  const { t, lang } = useI18n()
  const { theme } = useTheme()
  
  return (
    <section id="ipv6" className={`py-10 sm:py-16 px-3 sm:px-6 lg:px-8 scroll-mt-16 ${theme === 'dark' ? 'bg-muted/20' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
            <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{t('ipv6.title')}</h2>
            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('ipv6.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <SectionCard title={t('ipv6.overview.title')}>
            <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('ipv6.overview.content')}
            </p>
          </SectionCard>

          <SectionCard title={t('ipv6.address.title')}>
            <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('ipv6.address.format_desc')}
            </p>
            <div className={`rounded-lg p-3 sm:p-4 border mb-3 ${theme === 'dark' ? 'bg-muted/30 border-border' : 'bg-white border-gray-200'}`}>
              <div className="text-center">
                <div className="text-sm sm:text-base font-mono font-bold text-primary break-all">
                  2001:0db8:85a3:0000:0000:8a2e:0370:7334
                </div>
                <div className={`text-xs sm:text-sm mt-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
                  → 2001:db8:85a3::8a2e:370:7334
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <div className={`p-2 rounded border ${theme === 'dark' ? 'bg-muted/20 border-border' : 'bg-white border-gray-200'}`}>
                <div className={`text-xs mb-0.5 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('ipv6.address.rule1')}</div>
                <div className="font-mono text-xs">2001:0db8 → 2001:db8</div>
              </div>
              <div className={`p-2 rounded border ${theme === 'dark' ? 'bg-muted/20 border-border' : 'bg-white border-gray-200'}`}>
                <div className={`text-xs mb-0.5 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('ipv6.address.rule2')}</div>
                <div className="font-mono text-xs">2001:db8:0:0:0:0:0:1 → 2001:db8::1</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title={t('ipv6.types.title')}>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ['ipv6.types.unicast', 'ipv6.types.unicast_desc', 'green'],
                ['ipv6.types.anycast', 'ipv6.types.anycast_desc', 'yellow'],
                ['ipv6.types.multicast', 'ipv6.types.multicast_desc', 'blue'],
              ].map(([title, desc, color]) => (
                <div key={title} className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-muted/20 border-border' : 'bg-white border-gray-200'}`}>
                  <h4 className="font-semibold text-foreground mb-1 text-sm flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full bg-${color}-500`}></span>
                    {t(title)}
                  </h4>
                  <p className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t(desc)}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title={t('ipv6.transition.title')}>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ['ipv6.transition.dual', 'ipv6.transition.dual_desc'],
                ['ipv6.transition.tunnel', 'ipv6.transition.tunnel_desc'],
                ['ipv6.transition.nat64', 'ipv6.transition.nat64_desc'],
              ].map(([title, desc]) => (
                <div key={title} className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-muted/20 border-border' : 'bg-white border-gray-200'}`}>
                  <h4 className="font-semibold text-foreground mb-1 text-sm">{t(title)}</h4>
                  <p className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t(desc)}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </section>
  )
}

// ============================================
// 对比表格
// ============================================
function ComparisonSection() {
  const { t } = useI18n()
  const { theme } = useTheme()
  
  const comparisons = [
    [lang === 'zh' ? '地址长度' : 'Address Length', '32 bits', '128 bits'],
    [lang === 'zh' ? '地址数量' : 'Address Count', '~4.3 billion', '~340 undecillion'],
    [lang === 'zh' ? '表示法' : 'Notation', 'Dotted decimal', 'Colon hexadecimal'],
    [lang === 'zh' ? '示例' : 'Example', '192.168.1.1', '2001:db8::1'],
    [lang === 'zh' ? '头部大小' : 'Header Size', '20-60 bytes', '40 bytes fixed'],
    [lang === 'zh' ? '校验和' : 'Checksum', 'Yes', 'No'],
    [lang === 'zh' ? 'IPsec' : 'IPsec', 'Optional', 'Built-in'],
    [lang === 'zh' ? '自动配置' : 'Auto-config', 'DHCP', 'SLAAC/DHCPv6'],
    [lang === 'zh' ? 'NAT需求' : 'NAT Required', 'Common', 'Not needed'],
    [lang === 'zh' ? '组播支持' : 'Multicast', 'Optional', 'Required'],
    [lang === 'zh' ? '广播' : 'Broadcast', 'Yes', 'No (use multicast)'],
    [lang === 'zh' ? 'QoS' : 'QoS', 'ToS (8 bits)', 'Traffic Class + Flow Label'],
    [lang === 'zh' ? '分片' : 'Fragmentation', 'Routers + Sender', 'Sender only'],
    [lang === 'zh' ? '安全' : 'Security', 'Optional', 'Mandatory IPsec'],
    [lang === 'zh' ? '移动性' : 'Mobility', 'Mobile IPv4', 'Mobile IPv6 (native)'],
  ]
  
  const lng = lang // capture for closure
  
  return (
    <section id="comparison" className="py-10 sm:py-16 px-3 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
            <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{t('comparison.title')}</h2>
            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('comparison.subtitle')}</p>
          </div>
        </div>

        <Card className={`border overflow-hidden ${theme === 'dark' ? 'border-border bg-card/50' : 'border-gray-200 bg-white'}`}>
          <CardContent className="p-0">
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="min-w-[500px] px-3 sm:px-0">
                <Table>
                  <TableHeader>
                    <TableRow className={theme === 'dark' ? 'border-border bg-muted/50' : 'border-gray-200 bg-gray-50'}>
                      <TableHead className={theme === 'dark' ? 'text-foreground' : 'text-gray-900'}>{t('comparison.feature')}</TableHead>
                      <TableHead className={theme === 'dark' ? 'text-foreground' : 'text-gray-900'}>IPv4</TableHead>
                      <TableHead className={theme === 'dark' ? 'text-foreground' : 'text-gray-900'}>IPv6</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisons.map(([feature, ipv4, ipv6], i) => (
                      <TableRow key={i} className={theme === 'dark' ? 'border-border' : 'border-gray-200'}>
                        <TableCell className="font-medium text-xs sm:text-sm">{feature}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{ipv4}</TableCell>
                        <TableCell className="text-primary font-medium text-xs sm:text-sm">{ipv6}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// ============================================
// 其他章节（简化版）
// ============================================
function RoutingSection() {
  const { t } = useI18n()
  const { theme } = useTheme()
  return (
    <section id="routing" className={`py-10 sm:py-16 px-3 sm:px-6 lg:px-8 scroll-mt-16 ${theme === 'dark' ? 'bg-muted/20' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
            <Route className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{t('routing.title')}</h2>
            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('routing.subtitle')}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title={t('routing.table.title')}>
            <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('routing.table.intro')}
            </p>
          </SectionCard>
          <SectionCard title={t('routing.match.title')}>
            <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('routing.match.intro')}
            </p>
          </SectionCard>
        </div>
        <SectionCard title={t('routing.dynamic.title')}>
          <div className="grid gap-2 md:grid-cols-2 mt-2">
            {[t('routing.ospf'), t('routing.bgp'), t('routing.rip'), t('routing.isis')].map((proto, i) => (
              <div key={i} className={`p-2 rounded border text-xs ${theme === 'dark' ? 'bg-muted/20 border-border' : 'bg-white border-gray-200'}`}>
                {proto}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </section>
  )
}

function DNSSection() {
  const { t } = useI18n()
  const { theme } = useTheme()
  return (
    <section id="dns" className="py-10 sm:py-16 px-3 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
            <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{t('dns.title')}</h2>
            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('dns.subtitle')}</p>
          </div>
        </div>
        <SectionCard title={t('dns.records.title')}>
          <div className="grid gap-2 md:grid-cols-2">
            {[
              ['A', 'dns.records.a_desc'],
              ['AAAA', 'dns.records.aaaa_desc'],
              ['PTR', 'dns.records.ptr_desc'],
              ['MX', 'dns.records.mx_desc'],
              ['CNAME', 'dns.records.cname_desc'],
              ['TXT', 'dns.records.txt_desc'],
            ].map(([type, descKey]) => (
              <div key={type} className={`p-2 rounded border ${theme === 'dark' ? 'bg-muted/20 border-border' : 'bg-gray-50 border-gray-200'}`}>
                <span className="text-primary font-medium">{type}</span>
                <span className={`text-xs ml-2 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t(descKey)}</span>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title={t('dns.process.title')}>
          <CodeBlock language="bash" code={`# DNS query examples
dig example.com A          # Query A record
dig example.com AAAA       # Query AAAA record
dig -x 192.168.1.1         # Reverse lookup
nslookup example.com       # Simple lookup
host example.com           # Another lookup tool`} />
        </SectionCard>
      </div>
    </section>
  )
}

function CDNSection() {
  const { t } = useI18n()
  const { theme } = useTheme()
  return (
    <section id="cdn" className={`py-10 sm:py-16 px-3 sm:px-6 lg:px-8 scroll-mt-16 ${theme === 'dark' ? 'bg-muted/20' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
            <Cloud className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{t('cdn.title')}</h2>
            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('cdn.subtitle')}</p>
          </div>
        </div>
        <SectionCard title={t('cdn.principle.title')}>
          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
            {t('cdn.intro')}
          </p>
        </SectionCard>
        <SectionCard title={t('cdn.anycast.title')}>
          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
            {t('cdn.anycast.intro')}
          </p>
        </SectionCard>
      </div>
    </section>
  )
}

function TransportSection() {
  const { t } = useI18n()
  const { theme } = useTheme()
  return (
    <section id="transport" className="py-10 sm:py-16 px-3 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{t('transport.title')}</h2>
            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('transport.subtitle')}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title={t('transport.tcp.title')}>
            <p className={`text-xs sm:text-sm leading-relaxed mb-2 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('transport.tcp.intro')}
            </p>
            <ul className={`text-xs space-y-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              <li>• {t('transport.tcp.connection')}</li>
              <li>• {t('transport.tcp.reliable')}</li>
              <li>• {t('transport.tcp.flow')}</li>
            </ul>
          </SectionCard>
          <SectionCard title={t('transport.udp.title')}>
            <p className={`text-xs sm:text-sm leading-relaxed mb-2 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('transport.udp.intro')}
            </p>
            <ul className={`text-xs space-y-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              <li>• {t('transport.udp.connectionless')}</li>
              <li>• {t('transport.udp.fast')}</li>
              <li>• {t('transport.udp.unreliable')}</li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </section>
  )
}

function GeoIPSection() {
  const { t } = useI18n()
  const { theme } = useTheme()
  return (
    <section id="geoip" className={`py-10 sm:py-16 px-3 sm:px-6 lg:px-8 scroll-mt-16 ${theme === 'dark' ? 'bg-muted/20' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{t('geoip.title')}</h2>
            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('geoip.subtitle')}</p>
          </div>
        </div>
        <SectionCard title={t('geoip.principle.title')}>
          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
            {t('geoip.principle.intro')}
          </p>
        </SectionCard>
      </div>
    </section>
  )
}

function MulticastSection() {
  const { t } = useI18n()
  const { theme } = useTheme()
  return (
    <section id="multicast" className="py-10 sm:py-16 px-3 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
            <Radio className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{t('multicast.title')}</h2>
            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('multicast.subtitle')}</p>
          </div>
        </div>
        <SectionCard title={t('multicast.address.title')}>
          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
            {t('multicast.intro')}
          </p>
        </SectionCard>
      </div>
    </section>
  )
}

function QoSSection() {
  const { t } = useI18n()
  const { theme } = useTheme()
  return (
    <section id="qos" className={`py-10 sm:py-16 px-3 sm:px-6 lg:px-8 scroll-mt-16 ${theme === 'dark' ? 'bg-muted/20' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
            <Gauge className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{t('qos.title')}</h2>
            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('qos.subtitle')}</p>
          </div>
        </div>
        <SectionCard title={t('qos.dscp.title')}>
          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
            {t('qos.dscp.intro')}
          </p>
        </SectionCard>
      </div>
    </section>
  )
}

function SecuritySection() {
  const { t } = useI18n()
  const { theme } = useTheme()
  return (
    <section id="security" className="py-10 sm:py-16 px-3 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{t('security.title')}</h2>
            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('security.subtitle')}</p>
          </div>
        </div>
        <SectionCard title={t('security.ipsec.title')}>
          <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
            {t('security.ipsec.intro')}
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className={`p-3 rounded border ${theme === 'dark' ? 'bg-muted/20 border-border' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className="font-semibold text-foreground mb-1 text-sm">{t('security.ah')}</h4>
              <p className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('security.ah_desc')}</p>
            </div>
            <div className={`p-3 rounded border ${theme === 'dark' ? 'bg-muted/20 border-border' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className="font-semibold text-foreground mb-1 text-sm">{t('security.esp')}</h4>
              <p className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('security.esp_desc')}</p>
            </div>
          </div>
        </SectionCard>
        <SectionCard title={t('security.vpn.title')}>
          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
            {t('security.vpn.intro')}
          </p>
        </SectionCard>
      </div>
    </section>
  )
}

function TunnelSection() {
  const { t } = useI18n()
  const { theme } = useTheme()
  return (
    <section id="tunnel" className={`py-10 sm:py-16 px-3 sm:px-6 lg:px-8 scroll-mt-16 ${theme === 'dark' ? 'bg-muted/20' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
            <GitBranch className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{t('tunnel.title')}</h2>
            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('tunnel.subtitle')}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ['tunnel.gre.title', 'tunnel.gre_desc'],
            ['tunnel.ipsec.title', 'tunnel.ipsec_desc'],
            ['tunnel.6to4.title', 'tunnel.6to4_desc'],
            ['tunnel.teredo.title', 'tunnel.teredo_desc'],
            ['tunnel.isatap.title', 'tunnel.isatap_desc'],
            ['tunnel.wireguard.title', 'tunnel.wireguard_desc'],
          ].map(([title, desc]) => (
            <SectionCard key={title} title={t(title)}>
              <p className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t(desc)}</p>
            </SectionCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function FutureSection() {
  const { t } = useI18n()
  const { theme } = useTheme()
  return (
    <section id="future" className="py-10 sm:py-16 px-3 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{t('future.title')}</h2>
            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>{t('future.subtitle')}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['future.iot.title', 'future.iot.intro', '50B+ devices'],
            ['future.5g.title', 'future.5g.intro', 'Native IPv6'],
            ['future.sdn.title', 'future.sdn.intro', 'Programmable'],
            ['future.edge.title', 'future.edge.intro', 'Low latency'],
            ['future.sr.title', 'future.sr.intro', 'Next-gen'],
          ].map(([title, intro, stat]) => (
            <SectionCard key={title} title={t(title)}>
              <p className={`text-xs sm:text-sm leading-relaxed mb-2 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
                {t(intro)}
              </p>
              <div className="text-primary font-medium text-xs">{stat}</div>
            </SectionCard>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// 返回顶部按钮
// ============================================
function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!show) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 p-2 sm:p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
    >
      <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
  )
}

// ============================================
// 页脚
// ============================================
function Footer() {
  const { t } = useI18n()
  const { theme } = useTheme()
  
  return (
    <footer className={`py-6 sm:py-8 border-t px-4 ${theme === 'dark' ? 'border-border' : 'border-gray-200'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {SITE_CONFIG.logoUrl ? (
              <img src={SITE_CONFIG.logoUrl} alt="Logo" className="h-6 w-6" />
            ) : (
              <Network className="h-6 w-6 text-primary" />
            )}
            <span className="font-bold text-primary">{SITE_CONFIG.siteName}</span>
          </div>
          
          {/* 分隔符 */}
          <span className={`hidden sm:inline ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-400'}`}>|</span>
          
          {/* 描述 */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('footer.docs')}
            </span>
            <span className={`hidden sm:inline ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-400'}`}>•</span>
            <span className={`text-xs sm:text-sm flex items-center gap-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              {t('footer.built')}
              <ExternalLink className="h-3 w-3" />
            </span>
          </div>
          
          {/* 分隔符 */}
          <span className={`hidden sm:inline ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-400'}`}>|</span>
          
          {/* 版权 */}
          <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
            © 2026 {SITE_CONFIG.siteName}
          </span>
        </div>
      </div>
    </footer>
  )
}

// ============================================
// 主页面组件
// ============================================
export default function Home() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'ipv4', 'ipv6', 'comparison', 'routing', 'dns', 'cdn', 'transport', 'geoip', 'multicast', 'qos', 'security', 'tunnel', 'future']
      for (const id of sections) {
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(id)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AppProvider>
      <div className={`min-h-screen ${useTheme ? '' : ''}`}>
        <Navbar />
        <TableOfContents activeSection={activeSection} />
        <main className="max-w-7xl mx-auto">
          <Hero />
          <IPv4Section />
          <IPv6Section />
          <ComparisonSection />
          <RoutingSection />
          <DNSSection />
          <CDNSection />
          <TransportSection />
          <GeoIPSection />
          <MulticastSection />
          <QoSSection />
          <SecuritySection />
          <TunnelSection />
          <FutureSection />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </AppProvider>
  )
}
