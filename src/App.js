import './App.css';

import "@patternfly/patternfly/patternfly.css"

import React from 'react';
import {
  Avatar,
  Brand,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  Drawer,
  DrawerActions,
  DrawerPanelBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  DrawerSection,
  Flex,
  FlexItem,
  Gallery,
  GalleryItem,
  KebabToggle,
  Nav,
  NavItem,
  NavList,
  NavVariants,
  OverflowMenu,
  OverflowMenuControl,
  OverflowMenuGroup,
  OverflowMenuItem,
  Page,
  PageHeader,
  PageSection,
  PageSectionVariants,
  PageSidebar,
  Pagination,
  Progress,
  Select,
  SelectVariant,
  SelectOption,
  SkipToContent,
  TextContent,
  Text,
  Title,
  ToolbarItem,
  ToolbarFilter,
} from '@patternfly/react-core';

import BellIcon from '@patternfly/react-icons/dist/js/icons/bell-icon';
import CogIcon from '@patternfly/react-icons/dist/js/icons/cog-icon';
import FilterIcon from '@patternfly/react-icons/dist/js/icons/filter-icon';
import TrashIcon from '@patternfly/react-icons/dist/js/icons/trash-icon';
import imgBrand from '@patternfly/react-core/src/components/Brand/examples/pfLogo.svg';
import imgAvatar from '@patternfly/react-core/src/components/Avatar/examples/avatarImg.svg';
import pfIcon from './pf-logo-small.svg';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      perPage: 10,
      isDrawerExpanded: false,
      activeCard: null,
      filters: {
        products: []
      },
      res: [],
      isUpperToolbarDropdownOpen: false,
      isUpperToolbarKebabDropdownOpen: false,
      isLowerToolbarDropdownOpen: false,
      isLowerToolbarKebabDropdownOpen: false,
      isCardKebabDropdownOpen: false,
      activeItem: 0
    };

    this.onPageDropdownToggle = isUpperToolbarDropdownOpen => {
      this.setState({
        isUpperToolbarDropdownOpen
      });
    };

    this.onPageDropdownSelect = event => {
      this.setState({
        isUpperToolbarDropdownOpen: !this.state.isUpperToolbarDropdownOpen
      });
    };

    this.onPageToolbarDropdownToggle = isPageToolbarDropdownOpen => {
      this.setState({
        isPageToolbarDropdownOpen
      });
    };

    this.onPageToolbarKebabDropdownToggle = isUpperToolbarKebabDropdownOpen => {
      this.setState({
        isUpperToolbarKebabDropdownOpen
      });
    };

    this.onToolbarDropdownToggle = isLowerToolbarDropdownOpen => {
      this.setState(prevState => ({
        isLowerToolbarDropdownOpen
      }));
    };

    this.onToolbarDropdownSelect = event => {
      this.setState({
        isLowerToolbarDropdownOpen: !this.state.isLowerToolbarDropdownOpen
      });
    };

    this.onToolbarKebabDropdownToggle = isLowerToolbarKebabDropdownOpen => {
      this.setState({
        isLowerToolbarKebabDropdownOpen
      });
    };

    this.onToolbarKebabDropdownSelect = event => {
      this.setState({
        isLowerToolbarKebabDropdownOpen: !this.state.isLowerToolbarKebabDropdownOpen
      });
    };

    this.onNavSelect = result => {
      this.setState({
        activeItem: result.itemId
      });
    };

    this.deleteItem = item => event => {
      const filter = getter => val => getter(val) !== item.id;
      this.setState({
        res: this.state.res.filter(filter(({ id }) => id)),
        selectedItems: this.state.selectedItems.filter(filter(id => id))
      });
    };

    this.onNameSelect = (event, selection) => {
      const checked = event.target.checked;
      this.setState(prevState => {
        const prevSelections = prevState.filters['products'];
        return {
          filters: {
            ...prevState.filters,
            ['products']: checked ? [...prevSelections, selection] : prevSelections.filter(value => value !== selection)
          }
        };
      });
    };

    this.onDelete = (type = '', id = '') => {
      if (type) {
        this.setState(prevState => {
          prevState.filters[type.toLowerCase()] = prevState.filters[type.toLowerCase()].filter(s => s !== id);
          return {
            filters: prevState.filters
          };
        });
      } else {
        this.setState({
          filters: {
            products: []
          }
        });
      }
    };

    this.onCloseDrawerClick = () => {
      this.setState({
        activeCard: null,
        isDrawerExpanded: false
      });
    };

    this.onKeyDown = event => {
      if (event.target !== event.currentTarget || event.currentTarget.id === this.state.activeCard) {
        return;
      }
      if ([13, 32].includes(event.keyCode)) {
        const newSelected = event.currentTarget.id;
        this.setState({
          activeCard: newSelected,
          isDrawerExpanded: true
        });
      }
    };

    this.onCardClick = event => {
      if (event.currentTarget.id === this.state.activeCard) {
        return;
      }

      const newSelected = event.currentTarget.id;

      this.setState({
        activeCard: newSelected,
        isDrawerExpanded: true
      });
    };

    this.onPerPageSelect = (_evt, perPage) => {
      this.setState({ page: 1, perPage })
    }

    this.onSetPage = (_evt, page) => {
      this.setState({ page })
    }
  }

  getAllItems() {
    const { res } = this.state;
    const collection = [];
    for (const items of res) {
      collection.push(items.id);
    }

    return collection;
  }

  fetch(page, perPage) {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/rewine/backend/wines?_page=${page}&_limit=${perPage}`)
      .then(resp => resp.json())
      .then(resp => this.setState({ res: resp, perPage, page }))
      .then(() => this.updateSelected())
      .catch(err => this.setState({ error: err }));
  }

  componentDidMount() {
    this.fetch(this.state.page, this.state.perPage);
  }

  buildFilterDropdown() {
    const { isLowerToolbarDropdownOpen, filters } = this.state;

    const filterDropdownItems = [
      <SelectOption key="patternfly" value="Patternfly" />,
      <SelectOption key="activemq" value="ActiveMQ" />,
      <SelectOption key="apachespark" value="Apache Spark" />,
      <SelectOption key="avro" value="Avro" />,
      <SelectOption key="azureservices" value="Azure Services" />,
      <SelectOption key="crypto" value="Crypto" />,
      <SelectOption key="dropbox" value="DropBox" />,
      <SelectOption key="jbossdatagrid" value="JBoss Data Grid" />,
      <SelectOption key="rest" value="REST" />,
      <SelectOption key="swagger" value="SWAGGER" />
    ];

    return (
      <ToolbarFilter categoryName="Products" chips={filters.products} deleteChip={this.onDelete}>
        <Select
          variant={SelectVariant.checkbox}
          aria-label="Products"
          onToggle={this.onToolbarDropdownToggle}
          onSelect={this.onNameSelect}
          selections={filters.products}
          isExpanded={isLowerToolbarDropdownOpen}
          placeholderText="Creator"
        >
          {filterDropdownItems}
        </Select>
      </ToolbarFilter>
    );
  }

  render() {
    const {
      isDrawerExpanded,
      activeCard,
      isUpperToolbarDropdownOpen,
      isLowerToolbarDropdownOpen,
      isUpperToolbarKebabDropdownOpen,
      isLowerToolbarKebabDropdownOpen,
      isCardKebabDropdownOpen,
      activeItem,
      filters,
      res
    } = this.state;

    const toolbarKebabDropdownItems = [
      <DropdownItem key="link">Link</DropdownItem>,
      <DropdownItem key="action" component="button">
        Action
      </DropdownItem>,
      <DropdownItem key="disabled link" isDisabled>
        Disabled Link
      </DropdownItem>,
      <DropdownItem key="disabled action" isDisabled component="button">
        Disabled Action
      </DropdownItem>,
      <DropdownSeparator key="separator" />,
      <DropdownItem key="separated link">Separated Link</DropdownItem>,
      <DropdownItem key="separated action" component="button">
        Separated Action
      </DropdownItem>
    ];

    const PageNav = (
      <Nav onSelect={this.onNavSelect} aria-label="Nav">
        <NavList>
          <NavItem itemId={0} isActive={activeItem === 0}>
            Home page
          </NavItem>
          <NavItem itemId={1} isActive={activeItem === 1}>
            Wines
          </NavItem>
          <NavItem itemId={2} isActive={activeItem === 2}>
            Countries
          </NavItem>
          <NavItem itemId={3} isActive={activeItem === 3}>
            Orders
          </NavItem>
          <NavItem itemId={4} isActive={activeItem === 4}>
            About
          </NavItem>
        </NavList>
      </Nav>
    );

    const userDropdownItems = [
      <DropdownItem>Link</DropdownItem>,
      <DropdownItem component="button">Action</DropdownItem>,
      <DropdownItem isDisabled>Disabled Link</DropdownItem>,
      <DropdownItem isDisabled component="button">
        Disabled Action
      </DropdownItem>,
      <DropdownSeparator />,
      <DropdownItem>Separated Link</DropdownItem>,
      <DropdownItem component="button">Separated Action</DropdownItem>
    ];

    const PageToolbar = <div>need to implement new toolbar</div>;

    const Header = (
      <PageHeader
        logo={<Brand src={imgBrand} alt="Patternfly Logo" />}
        toolbar={PageToolbar}
        avatar={<Avatar src={imgAvatar} alt="Avatar image" />}
        showNavToggle
      />
    );
    const Sidebar = <PageSidebar nav={PageNav} />;
    const pageId = 'main-content-card-view-default-nav';
    const PageSkipToContent = <SkipToContent href={`#${pageId}`}>Skip to Content</SkipToContent>;

    const filtered =
      filters.products.length > 0
        ? res.filter(card => {
            return filters.products.length === 0 || filters.products.includes(card.name);
          })
        : res;

    const icons = {
      pfIcon,
    };

    const drawerContent = (
      <Gallery hasGutter>
        {filtered.map((product, key) => (
          <React.Fragment>
            <Card
              isHoverable
              key={key}
              id={'card-view-' + key}
              onKeyDown={this.onKeyDown}
              onClick={this.onCardClick}
              isSelectable
              isSelected={activeCard === key}
            >

              <CardTitle>{product.name}</CardTitle>
              <CardHeader>
                <img src={product.imageURL} alt={`${product.name} icon`} style={{ height: '150px' }} />
              </CardHeader>
              <CardBody>{product.origin}</CardBody>

            </Card>
          </React.Fragment>
        ))}
      </Gallery>
    );

    const panelContent = (
      <DrawerPanelContent>
        <DrawerHead>
          <Title headingLevel="h2" size="xl">
            Wine's details
          </Title>
          <DrawerActions>
            <DrawerCloseButton onClick={this.onCloseDrawerClick} />
          </DrawerActions>
        </DrawerHead>
        <DrawerPanelBody>
          <Flex spaceItems={{ default: 'spaceItemsLg' }} direction={{ default: 'column' }}>
            <FlexItem>
              <p>
              Wine is a popular and important drink that accompanies and enhances a wide range of cuisines, from the simple and traditional stews to the most sophisticated and complex haute cuisines.
              Wine is often served with dinner. Sweet dessert wines may be served with the dessert course.
              </p>
            </FlexItem>
            <FlexItem>
              <Progress value={activeCard * 10} title="Alcohol %" />
            </FlexItem>
            <FlexItem>
              <Progress value={activeCard * 5} title="Sapidity" />
            </FlexItem>
          </Flex>
        </DrawerPanelBody>
      </DrawerPanelContent>
    );

    return (
      <React.Fragment>
        <Page
          header={Header}
          sidebar={Sidebar}
          isManagedSidebar
          skipToContent={PageSkipToContent}
          mainContainerId={pageId}
        >
          <PageSection variant={PageSectionVariants.light}>
            <TextContent>
              <Text component="h1">Wines</Text>
              <Text component="p">Welcome to the Red Wine Software store. Here's a list of our favourites:</Text>
            </TextContent>
          </PageSection>
          <PageSection isFilled>
            <Drawer isExpanded={isDrawerExpanded} className={'pf-m-inline-on-2xl'}>
              <DrawerSection className="pf-u-mb-md">
                <Divider component="div" />
              </DrawerSection>
              <DrawerContent panelContent={panelContent} className={'pf-m-no-background'}>
                <DrawerContentBody>{drawerContent}</DrawerContentBody>
              </DrawerContent>
            </Drawer>
          </PageSection>
          <PageSection isFilled={false} sticky="bottom" padding={{default: "noPadding"}} variant="light">
            <Pagination
              itemCount={filtered.length}
              page={this.state.page}
              perPage={this.state.perPage}
              onPerPageSelect={this.onPerPageSelect}
              onSetPage={this.onSetPage}
              variant="bottom"
            />
          </PageSection>
        </Page>
      </React.Fragment>
    );
  }
}

export default App;
