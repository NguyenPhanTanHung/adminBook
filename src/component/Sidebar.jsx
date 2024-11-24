import { BarChart2, Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
	{ name: "Lịch sử",icon: BarChart2, color: "#6366f1", href: "/"	},
	{ name: "Sản phẩm", icon: ShoppingBag, color: "#8B5CF6", href: "/products" },
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<motion.div
			style={{
				position: 'relative',
				zIndex: 10,
				transition: 'all 0.3s ease-out',
				flexShrink: 0,
				borderRadius:15,
				width: isSidebarOpen ? '256px' : '80px'
			}}
			animate={{ width: isSidebarOpen ? 256 : 60 }}
		>
			<div style={{
				height: '100%',
				backgroundColor: '#f9f9f9',
				backdropFilter: 'blur(10px)',
				padding: '16px',
				display: 'flex',
				flexDirection: 'column',
				borderRadius:5,
				borderRight: '1px solid rgba(107, 114, 128, 0.5)',
			}}>
				<motion.button
					whileHover={{ scale: 1 }}
					whileTap={{ scale: 0.7 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					style={{
						padding: '8px',
						borderRadius: '9999px',
						transition: 'background-color 0.3s',
						maxWidth: '35px',
						maxHeight: '35px',
						cursor: 'pointer',
						backgroundColor:'#ffffff'
					}}
				>
					<Menu size={10} />
				</motion.button>

				<nav style={{ marginTop: '32px', flexGrow: 1 }}>
					{SIDEBAR_ITEMS.map((item) => (
						<Link key={item.href} to={item.href} style={{ textDecoration: 'none' }}>
							<motion.div style={{
								display: 'flex',
								alignItems: 'center',
								padding: '16px',
								fontSize: '14px',
								fontWeight: 500,
								borderRadius: '8px',
								borderWidth:10,
								transition: 'background-color 0.3s',
								marginBottom: '8px',
								cursor: 'pointer',
								':hover': {
									backgroundColor: 'rgba(107, 114, 128, 0.5)',
								}
							}}>
								<item.icon size={20} style={{ color: item.color, minWidth: '10px' }} />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											style={{ marginLeft: '10px', whiteSpace: 'nowrap', color: item.color, fontSize:20, fontWeight:'bold', textDecoration:'none'  }}
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: 'auto' }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
				</nav>
			</div>
		</motion.div>
	);
};
export default Sidebar;